import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare global {
  interface Window { turnstile?: { render(element: HTMLElement, options: Record<string, unknown>): string; reset(id: string): void; remove(id: string): void }; }
}

@Component({
  selector: 'app-turnstile', standalone: true,
  template: '<div class="turnstile-box" #container aria-label="Verificación de seguridad"></div>',
  styles: [':host{display:flex;justify-content:center;min-height:65px}.turnstile-box{max-width:100%;overflow:hidden}'],
})
export class TurnstileComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) action = '';
  @Output() tokenChange = new EventEmitter<string>();
  @ViewChild('container', { static: true }) container!: ElementRef<HTMLElement>;
  private readonly http = inject(HttpClient);
  private widgetId = '';
  private readonly apiBase = window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : '/api';

  ngAfterViewInit(): void {
    this.http.get<{ siteKey: string }>(`${this.apiBase}/auth/turnstile-config`).subscribe({
      next: ({ siteKey }) => this.loadScript().then(() => this.render(siteKey)),
      error: () => this.tokenChange.emit(''),
    });
  }

  reset(): void { if (this.widgetId) window.turnstile?.reset(this.widgetId); this.tokenChange.emit(''); }
  ngOnDestroy(): void { if (this.widgetId) window.turnstile?.remove(this.widgetId); }

  private render(siteKey: string): void {
    if (!window.turnstile || this.widgetId) return;
    this.widgetId = window.turnstile.render(this.container.nativeElement, {
      sitekey: siteKey, action: this.action, theme: 'light', size: 'flexible',
      callback: (token: string) => this.tokenChange.emit(token),
      'expired-callback': () => this.tokenChange.emit(''),
      'error-callback': () => this.tokenChange.emit(''),
    });
  }

  private loadScript(): Promise<void> {
    if (window.turnstile) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>('script[data-finlex-turnstile]');
      if (existing) { existing.addEventListener('load', () => resolve(), { once: true }); return; }
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true; script.defer = true; script.dataset['finlexTurnstile'] = 'true';
      script.onload = () => resolve(); script.onerror = () => reject(); document.head.appendChild(script);
    });
  }
}
