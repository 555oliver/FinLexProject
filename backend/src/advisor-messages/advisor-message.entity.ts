import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { AdvisorConversation } from './advisor-conversation.entity';

export enum AdvisorMessageSenderRole { User = 'user', Admin = 'admin' }

@Entity({ name: 'advisor_messages' })
export class AdvisorMessage {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Index()
  @Column({ name: 'conversation_id', type: 'uuid' }) conversationId: string;
  @ManyToOne(() => AdvisorConversation, conversation => conversation.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'conversation_id' }) conversation: AdvisorConversation;
  @Column({ name: 'sender_id', type: 'uuid' }) senderId: string;
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sender_id' }) sender: User;
  @Column({ name: 'sender_role', type: 'varchar', length: 10 }) senderRole: AdvisorMessageSenderRole;
  @Column({ type: 'text' }) body: string;
  @Column({ name: 'read_at', type: 'timestamptz', nullable: true }) readAt: Date | null;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt: Date;
}
