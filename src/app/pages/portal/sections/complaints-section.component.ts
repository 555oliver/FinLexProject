import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Complaint, AuthService } from '../../../core/services/auth.service';

@Component({ selector: 'app-complaints-section', standalone: true, imports: [FormsModule], templateUrl: './complaints-section.component.html', styleUrl: './portal-sections.css', changeDetection: ChangeDetectionStrategy.OnPush })
export class ComplaintsSectionComponent implements OnInit {
  private readonly auth = inject(AuthService);
  readonly complaints = signal<Complaint[]>([]);
  readonly submitting = signal(false);
  readonly message = signal('');
  readonly error = signal('');
  reason = '';
  description = '';
  selectedFile?: File;

  ngOnInit(): void {
    this.loadComplaints();
  }

  selectFile(event: Event): void {
    this.selectedFile = (event.target as HTMLInputElement).files?.[0];
  }

  submit(): void {
    if (!this.reason || this.description.trim().length < 10 || this.submitting()) return;
    this.submitting.set(true); this.message.set(''); this.error.set('');
    this.auth.createComplaint(this.reason, this.description.trim(), this.selectedFile).subscribe({
      next: complaint => {
        this.complaints.update(items => [complaint, ...items]);
        this.reason = ''; this.description = ''; this.selectedFile = undefined;
        this.submitting.set(false); this.message.set('Queja enviada correctamente. Su estado es En revisión.');
      },
      error: () => { this.submitting.set(false); this.error.set('No fue posible enviar la queja.'); },
    });
  }

  date(value: string): string {
    return new Intl.DateTimeFormat('es-CO', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
  }

  private loadComplaints(): void {
    this.auth.listMyComplaints().subscribe({
      next: complaints => this.complaints.set(complaints),
      error: () => this.error.set('No fue posible cargar el historial de quejas.'),
    });
  }
}
