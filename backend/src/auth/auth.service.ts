import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { createHash, randomBytes } from 'crypto';
import { MailService } from '../mail/mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly mail: MailService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.users.create(dto);
    const token = randomBytes(32).toString('hex');
    await this.users.setVerificationToken(user.id, this.hashToken(token), new Date(Date.now() + 24 * 60 * 60 * 1000));
    const apiUrl = this.config.get('API_PUBLIC_URL', 'http://localhost:3000');
    await this.mail.sendVerificationEmail(user.email, user.names, `${apiUrl}/api/auth/verify-email?token=${token}`);
    return {
      message: 'Registro realizado. Revise su correo para activar la cuenta.',
      user: this.toProfile(user),
    };
  }

  async verifyEmail(token: string): Promise<void> {
    if (!token) throw new BadRequestException('El enlace de verificación no es válido.');
    const user = await this.users.findByVerificationToken(this.hashToken(token));
    if (!user || !user.verificationTokenExpiresAt || user.verificationTokenExpiresAt.getTime() < Date.now()) {
      throw new BadRequestException('El enlace de verificación no es válido o ha vencido.');
    }
    await this.users.verifyEmail(user.id);
  }

  async login(dto: LoginDto) {
    if (!dto.termsAccepted) throw new UnauthorizedException('Debe aceptar los términos y condiciones.');
    const user = await this.users.findByEmailWithPassword(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Correo o clave incorrectos.');
    }
    if (!user.emailVerifiedAt || !user.isActive) throw new UnauthorizedException('Debe verificar su correo antes de iniciar sesión.');
    await this.users.markTermsAccepted(user.id);
    return this.issueToken(user);
  }

  async requestPasswordChange(userId: string): Promise<{ message: string }> {
    const user = await this.users.findById(userId);
    if (!user) throw new BadRequestException('No fue posible localizar la cuenta.');
    const token = randomBytes(32).toString('hex');
    await this.users.setPasswordResetToken(user.id, this.hashToken(token), new Date(Date.now() + 60 * 60 * 1000));
    const frontendUrl = this.config.get('FRONTEND_URL', 'http://localhost:4200');
    await this.mail.sendPasswordResetEmail(user.email, user.names, `${frontendUrl}/portal/restablecer-clave?token=${token}`);
    return { message: 'Enviamos un enlace a su correo para cambiar la clave.' };
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const genericMessage = 'Si el correo está registrado, recibirá un enlace para restablecer su clave.';
    const user = await this.users.findByEmail(dto.email);
    if (!user || !user.isActive) return { message: genericMessage };
    const token = randomBytes(32).toString('hex');
    await this.users.setPasswordResetToken(user.id, this.hashToken(token), new Date(Date.now() + 60 * 60 * 1000));
    const frontendUrl = this.config.get('FRONTEND_URL', 'http://localhost:4200');
    await this.mail.sendPasswordResetEmail(user.email, user.names, `${frontendUrl}/portal/restablecer-clave?token=${token}`);
    return { message: genericMessage };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.users.findByPasswordResetToken(this.hashToken(dto.token));
    if (!user || !user.passwordResetTokenExpiresAt || user.passwordResetTokenExpiresAt.getTime() < Date.now()) {
      throw new BadRequestException('El enlace para cambiar la clave no es válido o ha vencido.');
    }
    await this.users.updatePassword(user.id, dto.password);
    return { message: 'La clave fue actualizada correctamente.' };
  }

  private async issueToken(user: User) {
    const profile = this.toProfile(user);
    return { accessToken: await this.jwt.signAsync({ sub: user.id, email: user.email, role: user.role }), user: profile };
  }

  private toProfile(user: User) {
    return {
      id: user.id, names: user.names, email: user.email, username: user.username, role: user.role,
      phone: user.phone, countryCode: user.countryCode, dialCode: user.dialCode,
      identityDocument: user.identityDocument, address: user.address, fiscalCountry: user.fiscalCountry,
      recoveryBalance: user.recoveryBalance, recoveredFunds: user.recoveredFunds,
      pendingFees: user.pendingFees, totalPaid: user.totalPaid, activePaymentPlan: user.activePaymentPlan,
    };
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
