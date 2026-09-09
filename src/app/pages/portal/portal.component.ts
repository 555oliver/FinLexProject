import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, ViewChild, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Country } from '../../core/models/country.model';
import { AuthService, UserDocument } from '../../core/services/auth.service';
import { CountryService } from '../../core/services/country.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AdvisorSectionComponent } from './sections/advisor-section.component';
import { ComplaintsSectionComponent } from './sections/complaints-section.component';
import { PaymentsSectionComponent } from './sections/payments-section.component';
import { ProfileSectionComponent } from './sections/profile-section.component';
import { SolutionsSectionComponent } from './sections/solutions-section.component';
import { AdminSectionComponent } from './sections/admin-section.component';
import { AdminComplaintsSectionComponent } from './sections/admin-complaints-section.component';
import { CaseSectionComponent } from './sections/case-section.component';
import { AdminCasesSectionComponent } from './sections/admin-cases-section.component';
import { AdminConfidentialEvaluationsSectionComponent } from './sections/admin-confidential-evaluations-section.component';
import { TurnstileComponent } from '../../core/components/turnstile/turnstile.component';

type PortalMode = 'login' | 'register' | 'forgot' | 'reset';
type PortalTab = 'admin' | 'adminComplaints' | 'adminCases' | 'adminEvaluations' | 'summary' | 'case' | 'solutions' | 'payments' | 'complaints' | 'advisor' | 'profile';

@Component({
  selector: 'app-portal-page',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule, RouterLink, TurnstileComponent, AdminSectionComponent, AdminComplaintsSectionComponent, AdminCasesSectionComponent, AdminConfidentialEvaluationsSectionComponent, CaseSectionComponent, SolutionsSectionComponent, PaymentsSectionComponent, ComplaintsSectionComponent, AdvisorSectionComponent, ProfileSectionComponent],
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortalPageComponent {
  @ViewChild('loginCaptcha') loginCaptcha?: TurnstileComponent;
  @ViewChild('registerCaptcha') registerCaptcha?: TurnstileComponent;
  @ViewChild('forgotCaptcha') forgotCaptcha?: TurnstileComponent;
  private readonly rememberedEmailKey = 'finlex.rememberedEmail';
  private readonly fb = inject(FormBuilder);
  private readonly countryService = inject(CountryService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly auth = inject(AuthService);
  readonly countries$ = this.countryService.countries$;
  readonly mode = signal<PortalMode>('login');
  readonly selectedCountry = signal<Country | null>(null);
  readonly message = signal('');
  readonly submitting = signal(false);
  readonly activePortalTab = signal<PortalTab>('summary');
  readonly registrationSuccess = signal(false);
  readonly verificationSuccess = signal(false);
  readonly showLoginPassword = signal(false);
  readonly showRegisterPassword = signal(false);
  readonly showResetPassword = signal(false);
  readonly passwordResetSuccess = signal(false);
  readonly forgotPasswordSuccess = signal(false);
  readonly passwordResetToken = signal('');
  readonly documents = signal<UserDocument[]>([]);
  readonly uploadingDocument = signal(false);
  readonly documentMessage = signal('');
  readonly loginCaptchaToken = signal('');
  readonly registerCaptchaToken = signal('');
  readonly forgotCaptchaToken = signal('');
  private registeredEmail = '';
  private adminNotificationsLoaded = false;
  private countries: Country[] = [];
  private readonly sectionToTab: Record<string, PortalTab> = {
    administracion: 'admin', 'quejas-usuarios': 'adminComplaints', 'casos-usuarios': 'adminCases', 'evaluaciones-confidenciales': 'adminEvaluations', resumen: 'summary', 'mi-caso': 'case', soluciones: 'solutions', pagos: 'payments',
    quejas: 'complaints', asesor: 'advisor', perfil: 'profile',
  };
  private readonly tabToSection: Record<PortalTab, string> = {
    admin: 'administracion', adminComplaints: 'quejas-usuarios', adminCases: 'casos-usuarios', adminEvaluations: 'evaluaciones-confidenciales', summary: 'resumen', case: 'mi-caso', solutions: 'soluciones', payments: 'pagos',
    complaints: 'quejas', advisor: 'asesor', profile: 'perfil',
  };

  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberEmail: [false],
    termsAccepted: [false, Validators.requiredTrue],
  });

  readonly registerForm = this.fb.nonNullable.group({
    names: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(80), Validators.pattern(/^[a-zA-Z0-9._-]+$/)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    countryCode: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9\s-]{6,18}$/)]],
    termsAccepted: [false, Validators.requiredTrue],
  });

  readonly resetPasswordForm = this.fb.nonNullable.group({
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  readonly forgotPasswordForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor() {
    const rememberedEmail = localStorage.getItem(this.rememberedEmailKey);
    if (rememberedEmail) this.loginForm.patchValue({ email: rememberedEmail, rememberEmail: true });
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const verification = params.get('verification');
      this.passwordResetToken.set(params.get('token') ?? '');
      if (verification === 'success') {
        this.message.set('');
        this.verificationSuccess.set(true);
      }
      if (verification === 'invalid') {
        this.verificationSuccess.set(false);
        this.message.set('El enlace de verificación no es válido o ha vencido.');
      }
    });
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const section = params.get('section') ?? 'login';
      if (section === 'restablecer-clave') {
        if (this.auth.isAuthenticated()) this.auth.logout();
        this.mode.set('reset');
        return;
      }
      if (section === 'olvide-clave') {
        this.mode.set('forgot');
        return;
      }
      if (section === 'login' || section === 'registro') {
        this.mode.set(section === 'registro' ? 'register' : 'login');
        if (this.auth.isAuthenticated()) void this.navigateAfterLogin();
        return;
      }
      if (!this.auth.isAuthenticated()) {
        this.adminNotificationsLoaded = false;
        void this.router.navigate(['/portal/login']);
        return;
      }
      if (this.auth.currentUser()?.role === 'admin' && !this.adminNotificationsLoaded) {
        this.adminNotificationsLoaded = true;
        this.auth.refreshAdminNotifications();
      }
      const tab = this.sectionToTab[section] ?? 'summary';
      if ((tab === 'admin' || tab === 'adminComplaints' || tab === 'adminCases' || tab === 'adminEvaluations') && this.auth.currentUser()?.role !== 'admin') {
        void this.router.navigate(['/portal/resumen']);
        return;
      }
      if (this.auth.currentUser()?.role === 'admin' && (tab === 'summary' || tab === 'case' || tab === 'payments' || tab === 'complaints')) {
        void this.router.navigate(['/portal/administracion']);
        return;
      }
      this.activePortalTab.set(tab);
      if (tab === 'summary') this.loadDocuments();
    });
    this.countries$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(countries => {
      this.countries = countries;
      const colombia = countries.find(country => country.code === 'CO') ?? countries[0] ?? null;
      if (colombia && !this.registerForm.controls.countryCode.value) {
        this.registerForm.controls.countryCode.setValue(colombia.code);
        this.selectedCountry.set(colombia);
      }
    });
    this.registerForm.controls.countryCode.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(code => this.selectedCountry.set(this.countries.find(country => country.code === code) ?? null));
  }

  setMode(mode: 'login' | 'register'): void {
    this.mode.set(mode);
    this.message.set('');
    void this.router.navigate(['/portal', mode === 'register' ? 'registro' : 'login']);
  }

  showForgotPassword(): void {
    this.message.set('');
    this.forgotPasswordForm.patchValue({ email: this.loginForm.controls.email.value });
    void this.router.navigate(['/portal/olvide-clave']);
  }

  submitForgotPassword(): void {
    this.forgotPasswordForm.markAllAsTouched();
    if (this.forgotPasswordForm.invalid) return;
    if (!this.forgotCaptchaToken()) { this.message.set('Complete la verificación de seguridad.'); return; }
    this.submitting.set(true); this.message.set('');
    this.auth.forgotPassword(this.forgotPasswordForm.controls.email.value, this.forgotCaptchaToken()).subscribe({
      next: () => { this.submitting.set(false); this.forgotPasswordSuccess.set(true); },
      error: (error: HttpErrorResponse) => { this.submitting.set(false); this.forgotCaptcha?.reset(); this.message.set(this.apiMessage(error, 'No fue posible procesar la solicitud.')); },
    });
  }

  finishForgotPassword(): void {
    this.forgotPasswordSuccess.set(false);
    void this.router.navigate(['/portal/login']);
  }

  setPortalTab(tab: PortalTab): void {
    if ((tab === 'admin' || tab === 'adminComplaints' || tab === 'adminCases' || tab === 'adminEvaluations') && this.auth.currentUser()?.role !== 'admin') return;
    if (this.auth.currentUser()?.role === 'admin' && (tab === 'summary' || tab === 'case' || tab === 'payments' || tab === 'complaints')) return;
    void this.router.navigate(['/portal', this.tabToSection[tab]]);
  }

  formatMoney(value: string | undefined): string {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(Number(value ?? 0));
  }

  formatUploadDate(value: string): string {
    return new Intl.DateTimeFormat('es-CO', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
  }

  onDocumentSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.uploadingDocument.set(true);
    this.documentMessage.set('');
    this.auth.uploadDocument(file).subscribe({
      next: document => {
        this.documents.update(items => [document, ...items]);
        this.uploadingDocument.set(false);
        this.documentMessage.set('Archivo subido correctamente.');
        input.value = '';
      },
      error: (error: HttpErrorResponse) => {
        this.uploadingDocument.set(false);
        this.documentMessage.set(this.apiMessage(error, 'No fue posible subir el archivo.'));
        input.value = '';
      },
    });
  }

  submitLogin(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;
    const { email, password, rememberEmail, termsAccepted } = this.loginForm.getRawValue();
    if (!this.loginCaptchaToken()) { this.message.set('Complete la verificación de seguridad.'); return; }
    this.submitting.set(true);
    this.message.set('');
    this.auth.login(email, password, termsAccepted, this.loginCaptchaToken()).subscribe({
      next: () => {
        this.submitting.set(false);
        if (rememberEmail) localStorage.setItem(this.rememberedEmailKey, email.trim().toLowerCase());
        else localStorage.removeItem(this.rememberedEmailKey);
        void this.navigateAfterLogin();
      },
      error: (error: HttpErrorResponse) => { this.submitting.set(false); this.loginCaptcha?.reset(); this.message.set(this.apiMessage(error, 'No fue posible iniciar sesión.')); },
    });
  }

  submitRegistration(): void {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.invalid) return;
    const value = this.registerForm.getRawValue();
    const country = this.selectedCountry();
    if (!country?.dialCode) { this.message.set('El país seleccionado no tiene un indicativo disponible.'); return; }
    if (!this.registerCaptchaToken()) { this.message.set('Complete la verificación de seguridad.'); return; }
    this.submitting.set(true);
    this.message.set('');
    this.auth.register({ ...value, dialCode: country.dialCode, captchaToken: this.registerCaptchaToken() }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.registeredEmail = value.email;
        this.registrationSuccess.set(true);
      },
      error: (error: HttpErrorResponse) => { this.submitting.set(false); this.registerCaptcha?.reset(); this.message.set(this.apiMessage(error, 'No fue posible crear la cuenta.')); },
    });
  }

  submitPasswordReset(): void {
    this.resetPasswordForm.markAllAsTouched();
    const { password, confirmPassword } = this.resetPasswordForm.getRawValue();
    if (this.resetPasswordForm.invalid || password !== confirmPassword) {
      this.message.set(password !== confirmPassword ? 'Las claves no coinciden.' : 'La clave debe tener mínimo 8 caracteres, mayúscula, minúscula y número.');
      return;
    }
    const token = this.passwordResetToken();
    if (!token) { this.message.set('El enlace para cambiar la clave no es válido.'); return; }
    this.submitting.set(true); this.message.set('');
    this.auth.resetPassword(token, password).subscribe({
      next: () => { this.submitting.set(false); this.passwordResetSuccess.set(true); },
      error: (error: HttpErrorResponse) => { this.submitting.set(false); this.message.set(this.apiMessage(error, 'No fue posible actualizar la clave.')); },
    });
  }

  finishPasswordReset(): void {
    this.passwordResetSuccess.set(false);
    this.resetPasswordForm.reset();
    void this.router.navigate(['/portal/login']);
  }

  hasError(form: 'login' | 'register', field: string): boolean {
    const control = form === 'login' ? this.loginForm.get(field) : this.registerForm.get(field);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  usernameErrorMessage(): string {
    const errors = this.registerForm.controls.username.errors;
    if (errors?.['required']) return 'Ingrese un nombre de usuario.';
    if (errors?.['minlength']) return 'El usuario debe tener al menos 4 caracteres.';
    if (errors?.['maxlength']) return 'El usuario no puede superar los 80 caracteres.';
    if (errors?.['pattern']) return 'Use únicamente letras, números, puntos, guiones o guiones bajos. No use espacios ni el símbolo @.';
    return 'Ingrese un nombre de usuario válido.';
  }

  continueToLogin(): void {
    this.registrationSuccess.set(false);
    this.loginForm.reset({ email: this.registeredEmail, password: '', rememberEmail: false, termsAccepted: false });
    this.registerForm.reset({
      names: '', email: '', username: '', password: '',
      countryCode: this.selectedCountry()?.code ?? '', phone: '', termsAccepted: false,
    });
    this.setMode('login');
  }

  closeVerificationModal(): void {
    this.verificationSuccess.set(false);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { verification: null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  logout(): void {
    this.auth.logout();
    this.activePortalTab.set('summary');
    void this.router.navigate(['/portal/login']);
  }

  private navigateAfterLogin(): Promise<boolean> {
    return this.router.navigate(['/portal', this.auth.currentUser()?.role === 'admin' ? 'administracion' : 'resumen']);
  }

  private loadDocuments(): void {
    this.auth.listDocuments().subscribe({
      next: documents => this.documents.set(documents),
      error: () => this.documentMessage.set('No fue posible cargar la actividad reciente.'),
    });
  }

  private apiMessage(error: HttpErrorResponse, fallback: string): string {
    const message = error.error?.message as string | string[] | undefined;
    return Array.isArray(message) ? message.join(' ') : message || fallback;
  }
}
