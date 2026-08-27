import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-private-evaluation-page',
  standalone: true,
  template: `
    <section class="private-evaluation-page">
      <div>
        <span>FinLex Group</span>
        <h1>Evaluación privada</h1>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .private-evaluation-page { min-height: calc(100vh - 80px); display: grid; place-items: center; padding: 150px 24px 70px; background: #f6f4ef; text-align: center; }
    .private-evaluation-page div { width: min(100%, 760px); padding: clamp(48px, 8vw, 90px); border: 1px solid rgba(10,22,40,.1); background: #fff; box-shadow: 0 20px 60px rgba(10,22,40,.07); }
    span { color: #a0804a; font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; }
    h1 { margin: 14px 0 0; color: #0a1628; font: 400 clamp(38px, 6vw, 64px)/1.1 var(--font-serif); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivateEvaluationPageComponent {}
