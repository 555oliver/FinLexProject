import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AuthService,
  ConfidentialEvaluation,
  ConfidentialEvaluationStatus,
} from '../../../core/services/auth.service';

interface EditableEvaluation extends ConfidentialEvaluation {
  selectedStatus: ConfidentialEvaluationStatus;
  saving?: boolean;
  saved?: boolean;
}

@Component({
  selector: 'app-admin-confidential-evaluations-section',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-confidential-evaluations-section.component.html',
  styleUrl: './portal-sections.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminConfidentialEvaluationsSectionComponent implements OnInit {
  private readonly auth = inject(AuthService);
  readonly evaluations = signal<EditableEvaluation[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly statuses: ConfidentialEvaluationStatus[] = ['Solicitada', 'En revisión', 'Contactada', 'Aprobada', 'Rechazada', 'Cancelada'];

  ngOnInit(): void {
    this.auth.listConfidentialEvaluations().subscribe({
      next: evaluations => {
        this.evaluations.set(evaluations.map(item => ({ ...item, selectedStatus: item.status })));
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No fue posible cargar las evaluaciones confidenciales.');
        this.loading.set(false);
      },
    });
  }

  save(evaluation: EditableEvaluation): void {
    evaluation.saving = true;
    evaluation.saved = false;
    this.error.set('');
    this.evaluations.set([...this.evaluations()]);
    this.auth.updateConfidentialEvaluationStatus(evaluation.id, evaluation.selectedStatus).subscribe({
      next: updated => {
        evaluation.status = updated.status;
        evaluation.updatedAt = updated.updatedAt;
        evaluation.saving = false;
        evaluation.saved = true;
        this.evaluations.set([...this.evaluations()]);
      },
      error: () => {
        evaluation.saving = false;
        this.error.set('No fue posible actualizar el estado de la evaluación.');
        this.evaluations.set([...this.evaluations()]);
      },
    });
  }

  date(value: string): string {
    return new Intl.DateTimeFormat('es-CO', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
  }
}
