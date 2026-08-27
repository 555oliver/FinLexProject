import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, RouterOutlet, FooterComponent],
  template: '<app-header /><main><router-outlet /></main><app-footer />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
