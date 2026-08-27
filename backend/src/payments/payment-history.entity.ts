import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'payment_history' })
export class PaymentHistory {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Index()
  @Column({ name: 'user_id', type: 'uuid' }) userId: string;
  @Column({ length: 80, default: 'Pago' }) concept: string;
  @Column({ type: 'numeric', precision: 14, scale: 2 }) amount: string;
  @Column({ length: 30, default: 'Pagado' }) status: string;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt: Date;
}
