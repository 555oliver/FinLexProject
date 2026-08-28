import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  private readonly auth = inject(AuthService);
  email = '';
  readonly submitting = signal(false);
  readonly success = signal('');
  readonly error = signal('');

  requestEvaluation(): void {
    const email = this.email.trim().toLowerCase();
    if (!email || this.submitting()) return;
    this.submitting.set(true);
    this.success.set('');
    this.error.set('');

    this.auth.requestConfidentialEvaluation(email).subscribe({
      next: () => {
        this.submitting.set(false);
        this.email = '';
        this.success.set('Solicitud enviada correctamente. Un asesor revisará su evaluación confidencial.');
      },
      error: (response: HttpErrorResponse) => {
        this.submitting.set(false);
        const message = response.error?.message;
        this.error.set(Array.isArray(message) ? message[0] : message || 'No fue posible enviar la solicitud. Intente nuevamente.');
      },
    });
  }
}
