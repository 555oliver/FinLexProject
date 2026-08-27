import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { GlobalLoadingComponent } from './core/components/global-loading/global-loading.component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, RouterOutlet, FooterComponent, GlobalLoadingComponent],
  template: '<app-global-loading /><app-header /><main><router-outlet /></main><app-footer />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
