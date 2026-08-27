import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'payment_methods' })
export class PaymentMethod {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Index()
  @Column({ name: 'user_id', type: 'uuid' }) userId: string;
  @Column({ name: 'card_type', type: 'varchar', length: 20 }) cardType: string;
  @Column({ name: 'cardholder_name', type: 'varchar', length: 150 }) cardholderName: string;
  @Column({ type: 'varchar', length: 30 }) brand: string;
  @Column({ name: 'last_four', type: 'varchar', length: 4 }) lastFour: string;
  @Column({ name: 'expiry_month', type: 'smallint' }) expiryMonth: number;
  @Column({ name: 'expiry_year', type: 'smallint' }) expiryYear: number;
  @Column({ name: 'is_default', type: 'boolean', default: false }) isDefault: boolean;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt: Date;
}
