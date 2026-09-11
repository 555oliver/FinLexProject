import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { AuthService, AuthUser } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-users-section',
  standalone: true,
  templateUrl: './admin-users-section.component.html',
  styleUrl: './portal-sections.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUsersSectionComponent implements OnInit {
  private readonly auth = inject(AuthService);
  readonly users = signal<AuthUser[]>([]);
  readonly loading = signal(true);
  readonly deletingId = signal<string | null>(null);
  readonly error = signal('');
  readonly success = signal('');

  ngOnInit(): void {
    this.auth.listUsers().subscribe({
      next: users => {
        this.users.set(users.filter(user => user.role === 'user'));
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No fue posible cargar los usuarios registrados.');
        this.loading.set(false);
      },
    });
  }

  remove(user: AuthUser): void {
    if (!window.confirm(`¿Desea eliminar la cuenta de ${user.names}? Esta acción no se puede deshacer.`)) return;
    this.error.set('');
    this.success.set('');
    this.deletingId.set(user.id);
    this.auth.deleteUser(user.id).pipe(finalize(() => this.deletingId.set(null))).subscribe({
      next: response => {
        this.users.update(users => users.filter(item => item.id !== user.id));
        this.success.set(response.message);
      },
      error: () => this.error.set(`No fue posible eliminar a ${user.names}.`),
    });
  }

  initials(names: string): string {
    return names.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase();
  }
}
