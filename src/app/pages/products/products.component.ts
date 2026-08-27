import { ChangeDetectionStrategy, Component } from '@angular/core';


@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [],
  templateUrl: './products.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsPageComponent {}