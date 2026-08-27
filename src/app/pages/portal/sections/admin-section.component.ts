import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService, AuthUser } from '../../../core/services/auth.service';

interface EditableUser extends AuthUser {
  recoveryBalanceValue: number;
  recoveredFundsValue: number;
  pendingFeesValue: number;
  totalPaidValue: number;
  activePaymentPlanValue: string;
  saving?: boolean;
  saved?: boolean;
}

@Component({ selector: 'app-admin-section', standalone: true, imports: [FormsModule], templateUrl: './admin-section.component.html', styleUrl: './portal-sections.css', changeDetection: ChangeDetectionStrategy.OnPush })
export class AdminSectionComponent implements OnInit {
  private readonly auth = inject(AuthService);
  readonly users = signal<EditableUser[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  ngOnInit(): void {
    this.auth.listUsers().subscribe({
      next: users => { this.users.set(users.map(user => ({
        ...user,
        recoveryBalanceValue: Number(user.recoveryBalance),
        recoveredFundsValue: Number(user.recoveredFunds),
        pendingFeesValue: 0,
        totalPaidValue: 0,
        activePaymentPlanValue: ['Pagado', 'Anulado', 'Rechazado', 'Pendiente'].includes(user.activePaymentPlan) ? user.activePaymentPlan : 'Pendiente',
      }))); this.loading.set(false); },
      error: () => { this.error.set('No fue posible cargar los usuarios.'); this.loading.set(false); },
    });
  }

  save(user: EditableUser): void {
    user.saving = true; user.saved = false; this.users.set([...this.users()]);
    this.auth.updateFinancialSummary(user.id, user.recoveryBalanceValue, user.recoveredFundsValue).subscribe({
      next: financial => this.auth.updatePaymentSummary(user.id, user.pendingFeesValue, user.totalPaidValue, user.activePaymentPlanValue).subscribe({
        next: updated => {
          Object.assign(user, financial, updated);
          user.pendingFeesValue = 0;
          user.totalPaidValue = 0;
          user.saving = false; user.saved = true; this.users.set([...this.users()]);
        },
        error: () => this.saveFailed(user),
      }),
      error: () => { user.saving = false; this.error.set(`No fue posible actualizar a ${user.names}.`); this.users.set([...this.users()]); },
    });
  }

  private saveFailed(user: EditableUser): void {
    user.saving = false;
    this.error.set(`No fue posible actualizar a ${user.names}.`);
    this.users.set([...this.users()]);
  }
}
