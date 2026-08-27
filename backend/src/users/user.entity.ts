import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Role } from './role.enum';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ length: 150 }) names: string;
  @Column({ unique: true, length: 180 }) email: string;
  @Column({ unique: true, length: 80 }) username: string;
  @Column({ name: 'password_hash', length: 255, select: false }) passwordHash: string;
  @Column({ type: 'varchar', length: 30, nullable: true }) phone: string | null;
  @Column({ name: 'country_code', type: 'varchar', length: 2, nullable: true }) countryCode: string | null;
  @Column({ name: 'dial_code', type: 'varchar', length: 8, nullable: true }) dialCode: string | null;
  @Index()
  @Column({ type: 'enum', enum: Role, enumName: 'user_role', default: Role.User }) role: Role;
  @Column({ name: 'is_active', default: true }) isActive: boolean;
  @Column({ name: 'terms_accepted_at', type: 'timestamptz', nullable: true }) termsAcceptedAt: Date | null;
  @Column({ name: 'recovery_balance', type: 'numeric', precision: 14, scale: 2, default: 0 }) recoveryBalance: string;
  @Column({ name: 'recovered_funds', type: 'numeric', precision: 14, scale: 2, default: 0 }) recoveredFunds: string;
  @Column({ name: 'pending_fees', type: 'numeric', precision: 14, scale: 2, default: 0 }) pendingFees: string;
  @Column({ name: 'total_paid', type: 'numeric', precision: 14, scale: 2, default: 0 }) totalPaid: string;
  @Column({ name: 'active_payment_plan', type: 'varchar', length: 100, default: 'Pendiente' }) activePaymentPlan: string;
  @Column({ name: 'identity_document', type: 'varchar', length: 50, nullable: true }) identityDocument: string | null;
  @Column({ type: 'varchar', length: 255, nullable: true }) address: string | null;
  @Column({ name: 'fiscal_country', type: 'varchar', length: 100, nullable: true }) fiscalCountry: string | null;
  @Column({ name: 'email_verified_at', type: 'timestamptz', nullable: true }) emailVerifiedAt: Date | null;
  @Index()
  @Column({ name: 'verification_token_hash', type: 'varchar', length: 64, nullable: true, select: false }) verificationTokenHash: string | null;
  @Column({ name: 'verification_token_expires_at', type: 'timestamptz', nullable: true, select: false }) verificationTokenExpiresAt: Date | null;
  @Index()
  @Column({ name: 'password_reset_token_hash', type: 'varchar', length: 64, nullable: true, select: false }) passwordResetTokenHash: string | null;
  @Column({ name: 'password_reset_token_expires_at', type: 'timestamptz', nullable: true, select: false }) passwordResetTokenExpiresAt: Date | null;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }) updatedAt: Date;
}
