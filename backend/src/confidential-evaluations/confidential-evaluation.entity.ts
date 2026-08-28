import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ConfidentialEvaluationStatus } from './confidential-evaluation-status.enum';

@Entity({ name: 'confidential_evaluations' })
export class ConfidentialEvaluation {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Index()
  @Column({ type: 'varchar', length: 254 })
  email: string;

  @Column({ type: 'varchar', length: 30, default: ConfidentialEvaluationStatus.Requested })
  status: ConfidentialEvaluationStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }) updatedAt: Date;
}
