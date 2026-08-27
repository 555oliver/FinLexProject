import { ConflictException, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DataSource, Not, Repository } from 'typeorm';
import { RegisterDto } from '../auth/dto/register.dto';
import { Role } from './role.enum';
import { User } from './user.entity';
import { UpdateFinancialSummaryDto } from './dto/update-financial-summary.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePaymentSummaryDto } from './dto/update-payment-summary.dto';
import { PaymentHistory } from '../payments/payment-history.entity';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly config: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.ensureAdminExists();
    await this.ensureSecondAdminExists();
  }

  async create(dto: RegisterDto): Promise<User> {
    const email = dto.email.trim().toLowerCase();
    const username = dto.username.trim().toLowerCase();
    if (await this.users.exists({ where: [{ email }, { username }] })) {
      throw new ConflictException('El correo o nombre de usuario ya está registrado.');
    }
    const user = this.users.create({
      names: dto.names.trim(), email, username,
      passwordHash: await bcrypt.hash(dto.password, 12),
      phone: dto.phone, countryCode: dto.countryCode.toUpperCase(), dialCode: dto.dialCode,
      role: Role.User,
      isActive: false,
      termsAcceptedAt: new Date(),
    });
    return this.users.save(user);
  }

  findByEmailWithPassword(email: string): Promise<User | null> {
    return this.users.createQueryBuilder('user').addSelect('user.passwordHash')
      .where('LOWER(user.email) = LOWER(:email)', { email }).getOne();
  }

  findByEmail(email: string): Promise<User | null> {
    return this.users.createQueryBuilder('user')
      .where('LOWER(user.email) = LOWER(:email)', { email: email.trim() })
      .getOne();
  }

  findById(id: string): Promise<User | null> {
    return this.users.findOneBy({ id, isActive: true });
  }

  async setVerificationToken(id: string, tokenHash: string, expiresAt: Date): Promise<void> {
    await this.users.update(id, { verificationTokenHash: tokenHash, verificationTokenExpiresAt: expiresAt });
  }

  findByVerificationToken(tokenHash: string): Promise<User | null> {
    return this.users.createQueryBuilder('user')
      .addSelect(['user.verificationTokenHash', 'user.verificationTokenExpiresAt'])
      .where('user.verificationTokenHash = :tokenHash', { tokenHash })
      .getOne();
  }

  async verifyEmail(id: string): Promise<void> {
    await this.users.update(id, {
      isActive: true,
      emailVerifiedAt: new Date(),
      verificationTokenHash: null,
      verificationTokenExpiresAt: null,
    });
  }

  async setPasswordResetToken(id: string, tokenHash: string, expiresAt: Date): Promise<void> {
    await this.users.update(id, { passwordResetTokenHash: tokenHash, passwordResetTokenExpiresAt: expiresAt });
  }

  findByPasswordResetToken(tokenHash: string): Promise<User | null> {
    return this.users.createQueryBuilder('user')
      .addSelect(['user.passwordResetTokenHash', 'user.passwordResetTokenExpiresAt'])
      .where('user.passwordResetTokenHash = :tokenHash', { tokenHash })
      .getOne();
  }

  async updatePassword(id: string, password: string): Promise<void> {
    await this.users.update(id, {
      passwordHash: await bcrypt.hash(password, 12),
      passwordResetTokenHash: null,
      passwordResetTokenExpiresAt: null,
    });
  }

  listSafe(): Promise<User[]> {
    return this.users.find({ order: { createdAt: 'DESC' } });
  }

  async markTermsAccepted(id: string): Promise<void> {
    await this.users.update(id, { termsAcceptedAt: new Date() });
  }

  async updateFinancialSummary(id: string, dto: UpdateFinancialSummaryDto): Promise<User> {
    await this.users.update(id, { recoveryBalance: dto.recoveryBalance.toFixed(2), recoveredFunds: dto.recoveredFunds.toFixed(2) });
    return this.users.findOneByOrFail({ id });
  }

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<User> {
    const email = dto.email.trim().toLowerCase();
    if (await this.users.exists({ where: { email, id: Not(id) } })) throw new ConflictException('El correo ya está registrado por otro usuario.');
    await this.users.update(id, {
      names: dto.names.trim(), email, phone: dto.phone?.trim() || null,
      identityDocument: dto.identityDocument?.trim() || null,
      address: dto.address?.trim() || null, fiscalCountry: dto.fiscalCountry?.trim() || null,
    });
    return this.users.findOneByOrFail({ id });
  }

  async updatePaymentSummary(id: string, dto: UpdatePaymentSummaryDto): Promise<User> {
    return this.dataSource.transaction(async manager => {
      const user = await manager.findOneByOrFail(User, { id });
      const pendingFees = Number(user.pendingFees) + dto.pendingFees;
      const totalPaid = Number(user.totalPaid) + dto.totalPaid;
      await manager.update(User, id, {
        pendingFees: pendingFees.toFixed(2),
        totalPaid: totalPaid.toFixed(2),
        activePaymentPlan: dto.activePaymentPlan,
      });
      if (dto.totalPaid > 0) {
        await manager.save(PaymentHistory, manager.create(PaymentHistory, {
          userId: id,
          concept: 'Pago',
          amount: dto.totalPaid.toFixed(2),
          status: 'Pagado',
        }));
      }
      return manager.findOneByOrFail(User, { id });
    });
  }

  private async ensureAdminExists(): Promise<void> {
    const email = this.config.get<string>('ADMIN_EMAIL', 'pedro.perez@finex.international.support').toLowerCase();
    if (await this.users.exists({ where: { email } })) return;
    await this.users.save(this.users.create({
      names: this.config.get<string>('ADMIN_NAMES', 'Pedro Pérez'),
      email,
      username: this.config.get<string>('ADMIN_USERNAME', 'pedro.perez').toLowerCase(),
      passwordHash: await bcrypt.hash(this.config.get<string>('ADMIN_PASSWORD', '123456789'), 12),
      role: Role.Admin,
      isActive: true,
    }));
  }


  private async ensureSecondAdminExists(): Promise<void> {
    const email = this.config.get<string>('SECOND_ADMIN_EMAIL', 'andres.perez@finex.international.admin.com').toLowerCase();
    if (await this.users.exists({ where: { email } })) return;
    await this.users.save(this.users.create({
      names: this.config.get<string>('SECOND_ADMIN_NAMES', 'Andrés Pérez'),
      email,
      username: this.config.get<string>('SECOND_ADMIN_USERNAME', 'andres.perez').toLowerCase(),
      passwordHash: await bcrypt.hash(this.config.getOrThrow<string>('SECOND_ADMIN_PASSWORD'), 12),
      role: Role.Admin,
      isActive: true,
    }));
  }
}
