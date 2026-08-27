import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../core/services/auth.service';
import { CountryService } from '../../../core/services/country.service';
import { Country } from '../../../core/models/country.model';

@Component({ selector: 'app-profile-section', standalone: true, imports: [ReactiveFormsModule], templateUrl: './profile-section.component.html', styleUrl: './portal-sections.css', changeDetection: ChangeDetectionStrategy.OnPush })
export class ProfileSectionComponent {
  readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly countryService = inject(CountryService);
  private readonly destroyRef = inject(DestroyRef);
  readonly countries$ = this.countryService.countries$;
  readonly countries = signal<Country[]>([]);
  readonly countrySearch = signal('');
  readonly countryDropdownOpen = signal(false);
  readonly selectedCountryCode = signal(this.auth.currentUser()?.fiscalCountry ?? this.auth.currentUser()?.countryCode ?? '');
  readonly selectedCountry = computed(() => this.countries().find(country => country.code === this.selectedCountryCode()) ?? null);
  readonly filteredCountries = computed(() => {
    const query = this.normalize(this.countrySearch());
    if (!query) return this.countries();
    return this.countries().filter(country =>
      this.normalize(country.name).includes(query) || country.code.toLowerCase().includes(query),
    );
  });
  readonly saving = signal(false);
  readonly message = signal('');
  readonly error = signal('');
  readonly passwordLinkSending = signal(false);
  readonly passwordMessage = signal('');
  readonly passwordError = signal('');
  readonly imageSaving = signal(false);
  readonly imageError = signal('');
  readonly user = this.auth.currentUser();

  readonly profileForm = this.fb.nonNullable.group({
    names: [this.user?.names ?? '', [Validators.required, Validators.minLength(2)]],
    identityDocument: [this.user?.identityDocument ?? ''],
    email: [this.user?.email ?? '', [Validators.required, Validators.email]],
    phone: [this.user?.phone ?? ''],
    address: [this.user?.address ?? ''],
    fiscalCountry: [this.user?.fiscalCountry ?? this.user?.countryCode ?? ''],
  });

  constructor() {
    this.countries$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(countries => {
      this.countries.set(countries);
      const currentValue = this.profileForm.controls.fiscalCountry.value;
      if (!currentValue) return;
      if (/^[A-Z]{2}$/.test(currentValue)) {
        this.selectedCountryCode.set(currentValue);
        return;
      }
      const country = countries.find(item => item.name.toLocaleLowerCase('es') === currentValue.toLocaleLowerCase('es'));
      if (country) {
        this.profileForm.controls.fiscalCountry.setValue(country.code);
        this.selectedCountryCode.set(country.code);
      }
    });
  }

  updateCountrySearch(event: Event): void {
    this.countrySearch.set((event.target as HTMLInputElement).value);
  }

  clearCountrySearch(): void {
    this.countrySearch.set('');
  }

  toggleCountryDropdown(): void {
    this.countryDropdownOpen.update(open => !open);
    if (this.countryDropdownOpen()) this.countrySearch.set('');
  }

  closeCountryDropdown(): void {
    this.countryDropdownOpen.set(false);
    this.countrySearch.set('');
  }

  selectFiscalCountry(country: Country): void {
    this.profileForm.controls.fiscalCountry.setValue(country.code);
    this.profileForm.controls.fiscalCountry.markAsDirty();
    this.selectedCountryCode.set(country.code);
    this.closeCountryDropdown();
  }

  save(): void {
    this.profileForm.markAllAsTouched();
    if (this.profileForm.invalid) return;
    this.saving.set(true); this.message.set(''); this.error.set('');
    this.auth.updateProfile(this.profileForm.getRawValue()).subscribe({
      next: () => { this.saving.set(false); this.message.set('Información actualizada correctamente.'); },
      error: (error: HttpErrorResponse) => { this.saving.set(false); this.error.set(error.error?.message || 'No fue posible actualizar el perfil.'); },
    });
  }

  requestPasswordChange(): void {
    if (this.passwordLinkSending()) return;
    this.passwordLinkSending.set(true); this.passwordMessage.set(''); this.passwordError.set('');
    this.auth.requestPasswordChange().subscribe({
      next: response => { this.passwordLinkSending.set(false); this.passwordMessage.set(response.message); },
      error: () => { this.passwordLinkSending.set(false); this.passwordError.set('No fue posible enviar el enlace.'); },
    });
  }

  selectProfileImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 1024 * 1024) {
      this.imageError.set('Seleccione una imagen JPG, PNG o WebP de máximo 1 MB.');
      return;
    }
    this.imageSaving.set(true); this.imageError.set('');
    this.auth.uploadProfileImage(file).subscribe({
      next: () => this.imageSaving.set(false),
      error: (error: HttpErrorResponse) => { this.imageSaving.set(false); this.imageError.set(error.error?.message || 'No fue posible subir la imagen.'); },
    });
  }

  removeProfileImage(): void {
    this.imageSaving.set(true); this.imageError.set('');
    this.auth.removeProfileImage().subscribe({
      next: () => this.imageSaving.set(false),
      error: () => { this.imageSaving.set(false); this.imageError.set('No fue posible eliminar la imagen.'); },
    });
  }

  private normalize(value: string): string {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
  }
}
