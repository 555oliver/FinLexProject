"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const users_service_1 = require("../users/users.service");
const crypto_1 = require("crypto");
const mail_service_1 = require("../mail/mail.service");
let AuthService = class AuthService {
    users;
    jwt;
    mail;
    config;
    constructor(users, jwt, mail, config) {
        this.users = users;
        this.jwt = jwt;
        this.mail = mail;
        this.config = config;
    }
    async register(dto) {
        const user = await this.users.create(dto);
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        await this.users.setVerificationToken(user.id, this.hashToken(token), new Date(Date.now() + 24 * 60 * 60 * 1000));
        const apiUrl = this.config.get('API_PUBLIC_URL') ?? this.config.get('URL', 'http://localhost:3000');
        await this.mail.sendVerificationEmail(user.email, user.names, `${apiUrl}/api/auth/verify-email?token=${token}`);
        return {
            message: 'Registro realizado. Revise su correo para activar la cuenta.',
            user: this.toProfile(user),
        };
    }
    async verifyEmail(token) {
        if (!token)
            throw new common_1.BadRequestException('El enlace de verificación no es válido.');
        const user = await this.users.findByVerificationToken(this.hashToken(token));
        if (!user || !user.verificationTokenExpiresAt || user.verificationTokenExpiresAt.getTime() < Date.now()) {
            throw new common_1.BadRequestException('El enlace de verificación no es válido o ha vencido.');
        }
        await this.users.verifyEmail(user.id);
    }
    async login(dto) {
        if (!dto.termsAccepted)
            throw new common_1.UnauthorizedException('Debe aceptar los términos y condiciones.');
        const user = await this.users.findByEmailWithPassword(dto.email);
        if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
            throw new common_1.UnauthorizedException('Correo o clave incorrectos.');
        }
        if (!user.emailVerifiedAt || !user.isActive)
            throw new common_1.UnauthorizedException('Debe verificar su correo antes de iniciar sesión.');
        await this.users.markTermsAccepted(user.id);
        return this.issueToken(user);
    }
    async requestPasswordChange(userId) {
        const user = await this.users.findById(userId);
        if (!user)
            throw new common_1.BadRequestException('No fue posible localizar la cuenta.');
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        await this.users.setPasswordResetToken(user.id, this.hashToken(token), new Date(Date.now() + 60 * 60 * 1000));
        const frontendUrl = this.config.get('FRONTEND_URL') ?? this.config.get('URL', 'http://localhost:4200');
        await this.mail.sendPasswordResetEmail(user.email, user.names, `${frontendUrl}/portal/restablecer-clave?token=${token}`);
        return { message: 'Enviamos un enlace a su correo para cambiar la clave.' };
    }
    async forgotPassword(dto) {
        const genericMessage = 'Si el correo está registrado, recibirá un enlace para restablecer su clave.';
        const user = await this.users.findByEmail(dto.email);
        if (!user || !user.isActive)
            return { message: genericMessage };
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        await this.users.setPasswordResetToken(user.id, this.hashToken(token), new Date(Date.now() + 60 * 60 * 1000));
        const frontendUrl = this.config.get('FRONTEND_URL') ?? this.config.get('URL', 'http://localhost:4200');
        await this.mail.sendPasswordResetEmail(user.email, user.names, `${frontendUrl}/portal/restablecer-clave?token=${token}`);
        return { message: genericMessage };
    }
    async resetPassword(dto) {
        const user = await this.users.findByPasswordResetToken(this.hashToken(dto.token));
        if (!user || !user.passwordResetTokenExpiresAt || user.passwordResetTokenExpiresAt.getTime() < Date.now()) {
            throw new common_1.BadRequestException('El enlace para cambiar la clave no es válido o ha vencido.');
        }
        await this.users.updatePassword(user.id, dto.password);
        return { message: 'La clave fue actualizada correctamente.' };
    }
    async issueToken(user) {
        const profile = this.toProfile(user);
        return { accessToken: await this.jwt.signAsync({ sub: user.id, email: user.email, role: user.role }), user: profile };
    }
    toProfile(user) {
        return {
            id: user.id, names: user.names, email: user.email, username: user.username, role: user.role,
            phone: user.phone, countryCode: user.countryCode, dialCode: user.dialCode,
            identityDocument: user.identityDocument, address: user.address, fiscalCountry: user.fiscalCountry,
            recoveryBalance: user.recoveryBalance, recoveredFunds: user.recoveredFunds,
            pendingFees: user.pendingFees, totalPaid: user.totalPaid, activePaymentPlan: user.activePaymentPlan,
        };
    }
    hashToken(token) {
        return (0, crypto_1.createHash)('sha256').update(token).digest('hex');
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        mail_service_1.MailService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map