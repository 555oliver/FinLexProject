import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-global-loading',
  template: `
    @if (loadingService.isLoading()) {
      <div class="global-loading" role="status" aria-live="polite" aria-label="Cargando información">
        <div class="global-loading__panel">
          <span class="global-loading__brand" aria-hidden="true">F</span>
          <span class="global-loading__spinner" aria-hidden="true"></span>
          <span class="global-loading__text">Procesando solicitud...</span>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalLoadingComponent {
  protected readonly loadingService = inject(LoadingService);
}
