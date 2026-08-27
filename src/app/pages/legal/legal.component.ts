import { ChangeDetectionStrategy, Component } from '@angular/core';


@Component({
  selector: 'app-legal-page',
  standalone: true,
  imports: [],
  templateUrl: './legal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalPageComponent {}