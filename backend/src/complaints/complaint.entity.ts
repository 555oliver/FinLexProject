import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { ComplaintStatus } from './complaint-status.enum';

@Entity({ name: 'complaints' })
export class Complaint {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Index()
  @Column({ name: 'user_id', type: 'uuid' }) userId: string;
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) user: User;
  @Column({ length: 120 }) reason: string;
  @Column({ type: 'text' }) description: string;
  @Column({ type: 'varchar', length: 30, default: ComplaintStatus.InReview }) status: ComplaintStatus;
  @Column({ name: 'attachment_name', type: 'varchar', length: 255, nullable: true }) attachmentName: string | null;
  @Column({ name: 'attachment_mime_type', type: 'varchar', length: 120, nullable: true }) attachmentMimeType: string | null;
  @Column({ name: 'attachment_size', type: 'integer', nullable: true }) attachmentSize: number | null;
  @Column({ name: 'attachment_data', type: 'bytea', nullable: true, select: false }) attachmentData: Buffer | null;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }) updatedAt: Date;
}
