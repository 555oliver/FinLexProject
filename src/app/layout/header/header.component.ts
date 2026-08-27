import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  menuOpen = false;

  toggleMenu(): void { this.menuOpen = !this.menuOpen; }
  closeMenu(): void { this.menuOpen = false; }

  @HostListener('window:scroll')
  onScroll(): void {
    document.getElementById('header')?.classList.toggle('scrolled', window.scrollY > 50);
  }
}
