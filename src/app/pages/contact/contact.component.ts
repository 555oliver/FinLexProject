import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPageComponent {}