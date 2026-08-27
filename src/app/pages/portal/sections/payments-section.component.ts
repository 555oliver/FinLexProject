import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { AuthService, AuthUser, PaymentHistory } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { PaymentMethod } from '../../../core/services/auth.service';

@Component({ selector: 'app-payments-section', standalone: true, imports: [FormsModule], templateUrl: './payments-section.component.html', styleUrl: './portal-sections.css', changeDetection: ChangeDetectionStrategy.OnPush })
export class PaymentsSectionComponent implements OnInit {
  private readonly auth = inject(AuthService);
  readonly user = signal<AuthUser | null>(this.auth.currentUser());
  readonly payments = signal<PaymentHistory[]>([]);
  readonly methods = signal<PaymentMethod[]>([]);
  readonly showMethodForm = signal(false);
  readonly savingMethod = signal(false);
  readonly methodError = signal('');
  readonly years = Array.from({ length: 16 }, (_, index) => new Date().getFullYear() + index);
  cardType: 'Crédito' | 'Débito' = 'Crédito';
  cardholderName = '';
  brand: PaymentMethod['brand'] = 'Visa';
  lastFour = '';
  expiryMonth = new Date().getMonth() + 1;
  expiryYear = new Date().getFullYear();

  ngOnInit(): void {
    this.auth.refreshCurrentUser().subscribe({ next: user => this.user.set(user) });
    this.auth.listPaymentHistory().subscribe({ next: payments => this.payments.set(payments) });
    this.auth.listPaymentMethods().subscribe({ next: methods => this.methods.set(methods) });
  }

  saveMethod(): void {
    if (this.savingMethod() || this.cardholderName.trim().length < 3 || !/^\d{4}$/.test(this.lastFour)) return;
    this.savingMethod.set(true); this.methodError.set('');
    this.auth.createPaymentMethod({
      cardType: this.cardType,
      cardholderName: this.cardholderName.trim(),
      brand: this.brand,
      lastFour: this.lastFour,
      expiryMonth: this.expiryMonth,
      expiryYear: this.expiryYear,
    }).subscribe({
      next: method => {
        this.methods.update(methods => [method, ...methods]);
        this.resetMethodForm();
        this.savingMethod.set(false); this.showMethodForm.set(false);
      },
      error: () => { this.savingMethod.set(false); this.methodError.set('No fue posible registrar el método de pago.'); },
    });
  }

  cancelMethodForm(): void {
    this.resetMethodForm(); this.showMethodForm.set(false); this.methodError.set('');
  }

  money(value: string | undefined): string {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(Number(value ?? 0));
  }

  date(value: string): string {
    return new Intl.DateTimeFormat('es-CO', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
  }

  private resetMethodForm(): void {
    this.cardType = 'Crédito'; this.cardholderName = ''; this.brand = 'Visa'; this.lastFour = '';
    this.expiryMonth = new Date().getMonth() + 1; this.expiryYear = new Date().getFullYear();
  }
}
