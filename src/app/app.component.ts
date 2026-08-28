import { AfterViewChecked, ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
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
export class AppComponent implements AfterViewChecked, OnDestroy {
  private readonly observedAttribute = 'data-finlex-animation-observed';
  private readonly animationObserver = typeof IntersectionObserver === 'undefined'
    ? null
    : new IntersectionObserver((entries, observer) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      }, { threshold: 0.08, rootMargin: '0px 0px -24px' });

  ngAfterViewChecked(): void {
    const pendingElements = document.querySelectorAll<HTMLElement>(
      `.animate-on-scroll:not([${this.observedAttribute}])`,
    );

    for (const element of pendingElements) {
      element.setAttribute(this.observedAttribute, 'true');
      if (this.animationObserver) this.animationObserver.observe(element);
      else element.classList.add('visible');
    }
  }

  ngOnDestroy(): void {
    this.animationObserver?.disconnect();
  }
}
