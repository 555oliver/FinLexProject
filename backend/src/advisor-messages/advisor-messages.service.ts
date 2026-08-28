import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Role } from '../users/role.enum';
import { User } from '../users/user.entity';
import { AdvisorConversation } from './advisor-conversation.entity';
import { AdvisorMessage, AdvisorMessageSenderRole } from './advisor-message.entity';

@Injectable()
export class AdvisorMessagesService {
  constructor(
    @InjectRepository(AdvisorConversation) private readonly conversations: Repository<AdvisorConversation>,
    @InjectRepository(AdvisorMessage) private readonly messages: Repository<AdvisorMessage>,
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async userMessages(userId: string): Promise<AdvisorMessage[]> {
    const conversation = await this.conversations.findOneBy({ userId });
    if (!conversation) return [];
    await this.messages.update({ conversationId: conversation.id, senderRole: AdvisorMessageSenderRole.Admin, readAt: IsNull() }, { readAt: new Date() });
    return this.messages.find({ where: { conversationId: conversation.id }, order: { createdAt: 'ASC' } });
  }

  async sendFromUser(userId: string, body: string): Promise<AdvisorMessage> {
    const conversation = await this.ensureConversation(userId);
    return this.createMessage(conversation, userId, AdvisorMessageSenderRole.User, body);
  }

  async adminConversations() {
    const conversations = await this.conversations.find({ relations: { user: true, messages: true }, order: { updatedAt: 'DESC' } });
    return conversations.map(conversation => {
      const ordered = [...(conversation.messages ?? [])].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      const lastMessage = ordered.at(-1);
      return {
        id: conversation.id,
        user: { id: conversation.user.id, names: conversation.user.names, email: conversation.user.email, profileImage: conversation.user.profileImage },
        lastMessage: lastMessage?.body ?? '',
        lastMessageAt: lastMessage?.createdAt ?? conversation.createdAt,
        unreadCount: ordered.filter(message => message.senderRole === AdvisorMessageSenderRole.User && !message.readAt).length,
      };
    });
  }

  async adminMessages(userId: string): Promise<AdvisorMessage[]> {
    const conversation = await this.conversations.findOneBy({ userId });
    if (!conversation) return [];
    await this.messages.update({ conversationId: conversation.id, senderRole: AdvisorMessageSenderRole.User, readAt: IsNull() }, { readAt: new Date() });
    return this.messages.find({ where: { conversationId: conversation.id }, order: { createdAt: 'ASC' } });
  }

  async sendFromAdmin(adminId: string, userId: string, body: string): Promise<AdvisorMessage> {
    const user = await this.users.findOneBy({ id: userId, role: Role.User });
    if (!user) throw new NotFoundException('El usuario de la conversación no existe.');
    const conversation = await this.ensureConversation(userId);
    return this.createMessage(conversation, adminId, AdvisorMessageSenderRole.Admin, body);
  }

  private async ensureConversation(userId: string): Promise<AdvisorConversation> {
    let conversation = await this.conversations.findOneBy({ userId });
    if (!conversation) {
      try {
        conversation = await this.conversations.save(this.conversations.create({ userId }));
      } catch {
        conversation = await this.conversations.findOneByOrFail({ userId });
      }
    }
    return conversation;
  }

  private async createMessage(conversation: AdvisorConversation, senderId: string, senderRole: AdvisorMessageSenderRole, rawBody: string): Promise<AdvisorMessage> {
    const message = await this.messages.save(this.messages.create({ conversationId: conversation.id, senderId, senderRole, body: rawBody.trim(), readAt: null }));
    conversation.updatedAt = new Date();
    await this.conversations.save(conversation);
    return message;
  }
}
