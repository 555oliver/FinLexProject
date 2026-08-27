import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  id: number;
  author: 'bot' | 'user';
  text: string;
}

@Component({ selector: 'app-advisor-section', standalone: true, imports: [FormsModule], templateUrl: './advisor-section.component.html', styleUrl: './portal-sections.css', changeDetection: ChangeDetectionStrategy.OnPush })
export class AdvisorSectionComponent {
  private readonly auth = inject(AuthService);
  private nextMessageId = 2;
  @ViewChild('chatMessages') private chatMessages?: ElementRef<HTMLDivElement>;

  readonly messageText = signal('');
  readonly sending = signal(false);
  readonly messages = signal<ChatMessage[]>([{
    id: 1,
    author: 'bot',
    text: `Hola, ${this.auth.currentUser()?.names ?? ''}. Soy el asistente virtual de FinLex. ¿En qué puedo ayudarle hoy?`,
  }]);

  updateMessage(event: Event): void {
    this.messageText.set((event.target as HTMLInputElement).value);
  }

  sendMessage(): void {
    const text = this.messageText().trim();
    if (!text || this.sending()) return;
    this.messages.update(messages => [...messages, { id: this.nextMessageId++, author: 'user', text }]);
    this.messageText.set('');
    this.sending.set(true);
    this.scrollToLatest();

    this.auth.sendChatMessage(text).subscribe({
      next: response => {
        this.messages.update(messages => [...messages, { id: this.nextMessageId++, author: 'bot', text: response.reply }]);
        this.sending.set(false);
        this.scrollToLatest();
      },
      error: () => {
        this.messages.update(messages => [...messages, { id: this.nextMessageId++, author: 'bot', text: 'No pude responder en este momento. Por favor, inténtelo nuevamente.' }]);
        this.sending.set(false);
        this.scrollToLatest();
      },
    });
  }

  private scrollToLatest(): void {
    setTimeout(() => {
      const element = this.chatMessages?.nativeElement;
      if (element) element.scrollTop = element.scrollHeight;
    });
  }
}
