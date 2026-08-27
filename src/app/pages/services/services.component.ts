import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './services.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesPageComponent {}