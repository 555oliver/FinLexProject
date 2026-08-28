import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService, UserCase } from '../../../core/services/auth.service';

interface EditableCase extends UserCase { selectedPhase: number; saving?: boolean; saved?: boolean; }

@Component({ selector: 'app-admin-cases-section', standalone: true, imports: [FormsModule], templateUrl: './admin-cases-section.component.html', styleUrl: './portal-sections.css', changeDetection: ChangeDetectionStrategy.OnPush })
export class AdminCasesSectionComponent implements OnInit {
  private readonly auth = inject(AuthService);
  readonly cases = signal<EditableCase[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly phases = ['Apertura del caso', 'Asignación de asesor', 'Notificación al broker / entidad', 'Negociación y recuperación parcial', 'Arbitraje / litigio', 'Cierre y devolución final'];

  ngOnInit(): void {
    this.auth.listAllCases().subscribe({
      next: cases => { this.cases.set(cases.map(item => ({ ...item, selectedPhase: item.currentPhase }))); this.loading.set(false); },
      error: () => { this.error.set('No fue posible cargar los casos.'); this.loading.set(false); },
    });
  }

  save(caseData: EditableCase): void {
    caseData.saving = true; caseData.saved = false; this.cases.set([...this.cases()]);
    this.auth.updateCasePhase(caseData.id, Number(caseData.selectedPhase)).subscribe({
      next: updated => { Object.assign(caseData, updated); caseData.saving = false; caseData.saved = true; this.cases.set([...this.cases()]); this.auth.syncPendingCases(this.cases()); },
      error: () => { caseData.saving = false; this.error.set('No fue posible actualizar la fase del caso.'); this.cases.set([...this.cases()]); },
    });
  }

  date(value: string): string { return new Intl.DateTimeFormat('es-CO', { dateStyle: 'short' }).format(new Date(value)); }
}
