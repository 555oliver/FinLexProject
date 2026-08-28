import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService, Complaint, ComplaintStatus } from '../../../core/services/auth.service';

interface EditableComplaint extends Complaint { selectedStatus: ComplaintStatus; saving?: boolean; saved?: boolean; }

@Component({ selector: 'app-admin-complaints-section', standalone: true, imports: [FormsModule], templateUrl: './admin-complaints-section.component.html', styleUrl: './portal-sections.css', changeDetection: ChangeDetectionStrategy.OnPush })
export class AdminComplaintsSectionComponent implements OnInit {
  private readonly auth = inject(AuthService);
  readonly complaints = signal<EditableComplaint[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  ngOnInit(): void {
    this.auth.listAllComplaints().subscribe({
      next: complaints => { this.complaints.set(complaints.map(item => ({ ...item, selectedStatus: item.status }))); this.loading.set(false); },
      error: () => { this.error.set('No fue posible cargar las quejas.'); this.loading.set(false); },
    });
  }

  save(complaint: EditableComplaint): void {
    complaint.saving = true; complaint.saved = false; this.complaints.set([...this.complaints()]);
    this.auth.updateComplaintStatus(complaint.id, complaint.selectedStatus).subscribe({
      next: updated => { complaint.status = updated.status; complaint.saving = false; complaint.saved = true; this.complaints.set([...this.complaints()]); this.auth.syncPendingComplaints(this.complaints()); },
      error: () => { complaint.saving = false; this.error.set('No fue posible actualizar la queja.'); this.complaints.set([...this.complaints()]); },
    });
  }

  date(value: string): string {
    return new Intl.DateTimeFormat('es-CO', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
  }
}
