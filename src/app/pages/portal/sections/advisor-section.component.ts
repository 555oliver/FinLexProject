import { ChangeDetectionStrategy, Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdvisorConversation, AdvisorMessage, AuthService } from '../../../core/services/auth.service';

@Component({ selector: 'app-advisor-section', standalone: true, imports: [FormsModule], templateUrl: './advisor-section.component.html', styleUrl: './portal-sections.css', changeDetection: ChangeDetectionStrategy.OnPush })
export class AdvisorSectionComponent implements OnInit, OnDestroy {
  readonly auth = inject(AuthService);
  readonly isAdmin = this.auth.currentUser()?.role === 'admin';
  @ViewChild('chatMessages') private chatMessages?: ElementRef<HTMLDivElement>;
  readonly conversations = signal<AdvisorConversation[]>([]);
  readonly selectedConversation = signal<AdvisorConversation | null>(null);
  readonly messages = signal<AdvisorMessage[]>([]);
  readonly messageText = signal('');
  readonly loading = signal(true);
  readonly sending = signal(false);
  readonly error = signal('');
  private refreshTimer?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.isAdmin ? this.loadConversations() : this.loadUserMessages();
    this.refreshTimer = setInterval(() => this.refreshSilently(), 12000);
  }

  ngOnDestroy(): void { if (this.refreshTimer) clearInterval(this.refreshTimer); }

  updateMessage(event: Event): void { this.messageText.set((event.target as HTMLInputElement).value); }

  loadConversations(): void {
    this.loading.set(true); this.error.set('');
    this.auth.listAdvisorConversations().subscribe({
      next: items => { this.conversations.set(items); this.loading.set(false); },
      error: () => { this.error.set('No fue posible cargar las conversaciones.'); this.loading.set(false); },
    });
  }

  selectConversation(conversation: AdvisorConversation): void {
    this.selectedConversation.set(conversation); this.loading.set(true); this.error.set('');
    this.auth.listAdvisorConversationMessages(conversation.user.id).subscribe({
      next: messages => {
        this.messages.set(messages); this.loading.set(false);
        this.conversations.update(items => items.map(item => item.id === conversation.id ? { ...item, unreadCount: 0 } : item));
        this.auth.syncPendingAdvisorMessages(this.conversations()); this.scrollToLatest();
      },
      error: () => { this.error.set('No fue posible abrir la conversación.'); this.loading.set(false); },
    });
  }

  loadUserMessages(): void {
    this.loading.set(true); this.error.set('');
    this.auth.listMyAdvisorMessages().subscribe({
      next: messages => { this.messages.set(messages); this.loading.set(false); this.scrollToLatest(); },
      error: () => { this.error.set('No fue posible cargar sus mensajes.'); this.loading.set(false); },
    });
  }

  sendMessage(): void {
    const body = this.messageText().trim();
    if (!body || this.sending()) return;
    this.sending.set(true); this.error.set('');
    const request = this.isAdmin
      ? this.auth.replyAdvisorConversation(this.selectedConversation()!.user.id, body)
      : this.auth.sendAdvisorMessage(body);
    request.subscribe({
      next: message => {
        this.messages.update(items => [...items, message]); this.messageText.set(''); this.sending.set(false); this.scrollToLatest();
        if (this.isAdmin) this.loadConversationsSilently();
      },
      error: () => { this.error.set('No fue posible enviar el mensaje.'); this.sending.set(false); },
    });
  }

  refresh(): void {
    if (this.isAdmin) {
      const selected = this.selectedConversation();
      selected ? this.selectConversation(selected) : this.loadConversations();
    } else this.loadUserMessages();
  }

  time(value: string): string { return new Intl.DateTimeFormat('es-CO', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value)); }

  private loadConversationsSilently(): void {
    this.auth.listAdvisorConversations(true).subscribe({ next: items => this.conversations.set(items), error: () => undefined });
  }

  private refreshSilently(): void {
    if (this.isAdmin) {
      this.auth.listAdvisorConversations(true).subscribe({
        next: conversations => {
          this.conversations.set(conversations);
          const selected = this.selectedConversation();
          if (!selected) return;
          this.auth.listAdvisorConversationMessages(selected.user.id, true).subscribe({ next: messages => { this.messages.set(messages); this.scrollToLatest(); }, error: () => undefined });
        },
        error: () => undefined,
      });
      return;
    }
    this.auth.listMyAdvisorMessages(true).subscribe({ next: messages => { this.messages.set(messages); this.scrollToLatest(); }, error: () => undefined });
  }

  private scrollToLatest(): void { setTimeout(() => { const element = this.chatMessages?.nativeElement; if (element) element.scrollTop = element.scrollHeight; }); }
}
