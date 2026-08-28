import { CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, Column, Index } from 'typeorm';
import { User } from '../users/user.entity';
import { AdvisorMessage } from './advisor-message.entity';

@Entity({ name: 'advisor_conversations' })
export class AdvisorConversation {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Index({ unique: true })
  @Column({ name: 'user_id', type: 'uuid', unique: true }) userId: string;
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) user: User;
  @OneToMany(() => AdvisorMessage, message => message.conversation) messages: AdvisorMessage[];
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }) updatedAt: Date;
}
