import { AfterViewChecked, ChangeDetectionStrategy, Component, OnDestroy, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { GlobalLoadingComponent } from './core/components/global-loading/global-loading.component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, RouterOutlet, FooterComponent, GlobalLoadingComponent],
  template: `
    <app-global-loading />
    <app-header />
    <main><router-outlet /></main>
    <app-footer />

    <aside class="whatsapp-contact" aria-label="Contacto por WhatsApp">
      @if (whatsAppNoticeOpen()) {
        <div class="whatsapp-contact__notice" role="status">
          <button type="button" class="whatsapp-contact__close" (click)="closeWhatsAppNotice()" aria-label="Cerrar aviso">&times;</button>
          <strong>WhatsApp FinLex</strong>
          <span>El canal con nuestros asesores estará disponible próximamente.</span>
        </div>
      }
      <button
        type="button"
        class="whatsapp-contact__button"
        (click)="openWhatsApp()"
        aria-label="Hablar con un asesor por WhatsApp"
        [attr.aria-expanded]="whatsAppNoticeOpen()"
      >
        <svg aria-hidden="true" viewBox="0 0 32 32" focusable="false">
          <path fill="currentColor" d="M16.04 3A12.83 12.83 0 0 0 5 22.34L3.2 29l6.82-1.79A12.88 12.88 0 1 0 16.04 3Zm0 23.58c-1.9 0-3.75-.51-5.37-1.47l-.39-.23-4.05 1.06 1.08-3.95-.25-.41a10.67 10.67 0 1 1 8.98 5Zm5.85-7.98c-.32-.16-1.9-.94-2.2-1.05-.29-.11-.5-.16-.72.16-.21.32-.82 1.05-1.01 1.26-.19.22-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59a9.62 9.62 0 0 1-1.78-2.22c-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.18.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.08-1.11 2.64s1.14 3.07 1.3 3.28c.16.21 2.24 3.42 5.42 4.8.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.9-.78 2.17-1.53.26-.75.26-1.4.18-1.53-.08-.14-.29-.22-.61-.38Z"/>
        </svg>
        <span>Hablar con un asesor</span>
      </button>
    </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements AfterViewChecked, OnDestroy {
  /** Agregue aquí el número con código de país, únicamente con dígitos. Ejemplo: 573001234567. */
  private readonly whatsAppBusinessNumber = '';
  readonly whatsAppNoticeOpen = signal(false);

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

  openWhatsApp(): void {
    const number = this.whatsAppBusinessNumber.replace(/\D/g, '');
    if (!number) {
      this.whatsAppNoticeOpen.set(true);
      return;
    }

    const message = encodeURIComponent('Hola, quisiera hablar con un asesor de FinLex.');
    window.open(`https://wa.me/${number}?text=${message}`, '_blank', 'noopener,noreferrer');
  }

  closeWhatsAppNotice(): void {
    this.whatsAppNoticeOpen.set(false);
  }

  ngOnDestroy(): void {
    this.animationObserver?.disconnect();
  }
}
