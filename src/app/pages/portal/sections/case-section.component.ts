import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { AuthService, UserCase } from '../../../core/services/auth.service';

@Component({ selector: 'app-case-section', standalone: true, templateUrl: './case-section.component.html', styleUrl: './portal-sections.css', changeDetection: ChangeDetectionStrategy.OnPush })
export class CaseSectionComponent implements OnInit {
  private readonly auth = inject(AuthService);
  readonly cases = signal<UserCase[]>([]);
  readonly activeCase = computed(() => this.cases().find(item => item.progress < 100) ?? null);
  readonly solvedCases = computed(() => this.cases().filter(item => item.progress === 100));
  readonly canCreate = computed(() => !this.activeCase());
  readonly loading = signal(true);
  readonly creating = signal(false);
  readonly error = signal('');
  readonly phases = [
    { name: 'Apertura del caso', description: 'Recepción de documentación inicial y análisis de transacciones.' },
    { name: 'Asignación de asesor', description: 'Asignación de un asesor especializado y primera reunión de diagnóstico.' },
    { name: 'Notificación al broker / entidad', description: 'Carta formal de reclamación enviada con respaldo legal.' },
    { name: 'Negociación y recuperación parcial', description: 'Negociación activa para la recuperación de fondos.' },
    { name: 'Arbitraje / litigio', description: 'Preparación de demanda arbitral si no hay acuerdo total.' },
    { name: 'Cierre y devolución final', description: 'Liquidación de fondos recuperados al cliente.' },
  ];

  ngOnInit(): void {
    this.auth.getMyCase().subscribe({
      next: cases => { this.cases.set(cases); this.loading.set(false); },
      error: () => { this.error.set('No fue posible cargar la información de los casos.'); this.loading.set(false); },
    });
  }

  createCase(): void {
    if (this.creating() || !this.canCreate()) return;
    this.creating.set(true); this.error.set('');
    this.auth.createCase().subscribe({
      next: userCase => { this.cases.update(items => [userCase, ...items]); this.creating.set(false); },
      error: () => { this.error.set('No fue posible crear el caso.'); this.creating.set(false); },
    });
  }

  phaseState(index: number, caseData: UserCase): 'Completado' | 'En curso' | 'Pendiente' {
    if (caseData.progress === 100) return 'Completado';
    return index < caseData.currentPhase ? 'Completado' : index === caseData.currentPhase ? 'En curso' : 'Pendiente';
  }

  date(value: string): string {
    return new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' }).format(new Date(value));
  }
}
