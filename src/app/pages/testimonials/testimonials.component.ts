import { ChangeDetectionStrategy, Component } from '@angular/core';


@Component({
  selector: 'app-testimonials-page',
  standalone: true,
  imports: [],
  templateUrl: './testimonials.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonialsPageComponent {}