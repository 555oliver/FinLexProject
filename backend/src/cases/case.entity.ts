import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity({ name: 'cases' })
export class CaseRecord {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Index()
  @Column({ name: 'user_id', type: 'uuid' }) userId: string;
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) user: User;
  @Index({ unique: true })
  @Column({ name: 'case_number', type: 'varchar', length: 30, unique: true }) caseNumber: string;
  @Column({ name: 'current_phase', type: 'smallint', default: 0 }) currentPhase: number;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }) updatedAt: Date;
}
