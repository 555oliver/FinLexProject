import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_documents' })
export class UserDocument {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Index()
  @Column({ name: 'user_id', type: 'uuid' }) userId: string;
  @Column({ name: 'original_name', length: 255 }) originalName: string;
  @Column({ name: 'mime_type', length: 120 }) mimeType: string;
  @Column({ type: 'integer' }) size: number;
  @Column({ type: 'bytea', select: false }) data: Buffer;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt: Date;
}
