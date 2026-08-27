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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt = require("bcryptjs");
const typeorm_2 = require("typeorm");
const role_enum_1 = require("./role.enum");
const user_entity_1 = require("./user.entity");
const payment_history_entity_1 = require("../payments/payment-history.entity");
let UsersService = class UsersService {
    users;
    config;
    dataSource;
    constructor(users, config, dataSource) {
        this.users = users;
        this.config = config;
        this.dataSource = dataSource;
    }
    async onModuleInit() {
        await this.ensureAdminExists();
        await this.ensureSecondAdminExists();
    }
    async create(dto) {
        const email = dto.email.trim().toLowerCase();
        const username = dto.username.trim().toLowerCase();
        if (await this.users.exists({ where: [{ email }, { username }] })) {
            throw new common_1.ConflictException('El correo o nombre de usuario ya está registrado.');
        }
        const user = this.users.create({
            names: dto.names.trim(), email, username,
            passwordHash: await bcrypt.hash(dto.password, 12),
            phone: dto.phone, countryCode: dto.countryCode.toUpperCase(), dialCode: dto.dialCode,
            role: role_enum_1.Role.User,
            isActive: false,
            termsAcceptedAt: new Date(),
        });
        return this.users.save(user);
    }
    findByEmailWithPassword(email) {
        return this.users.createQueryBuilder('user').addSelect('user.passwordHash')
            .where('LOWER(user.email) = LOWER(:email)', { email }).getOne();
    }
    findByEmail(email) {
        return this.users.createQueryBuilder('user')
            .where('LOWER(user.email) = LOWER(:email)', { email: email.trim() })
            .getOne();
    }
    findById(id) {
        return this.users.findOneBy({ id, isActive: true });
    }
    async setVerificationToken(id, tokenHash, expiresAt) {
        await this.users.update(id, { verificationTokenHash: tokenHash, verificationTokenExpiresAt: expiresAt });
    }
    findByVerificationToken(tokenHash) {
        return this.users.createQueryBuilder('user')
            .addSelect(['user.verificationTokenHash', 'user.verificationTokenExpiresAt'])
            .where('user.verificationTokenHash = :tokenHash', { tokenHash })
            .getOne();
    }
    async verifyEmail(id) {
        await this.users.update(id, {
            isActive: true,
            emailVerifiedAt: new Date(),
            verificationTokenHash: null,
            verificationTokenExpiresAt: null,
        });
    }
    async setPasswordResetToken(id, tokenHash, expiresAt) {
        await this.users.update(id, { passwordResetTokenHash: tokenHash, passwordResetTokenExpiresAt: expiresAt });
    }
    findByPasswordResetToken(tokenHash) {
        return this.users.createQueryBuilder('user')
            .addSelect(['user.passwordResetTokenHash', 'user.passwordResetTokenExpiresAt'])
            .where('user.passwordResetTokenHash = :tokenHash', { tokenHash })
            .getOne();
    }
    async updatePassword(id, password) {
        await this.users.update(id, {
            passwordHash: await bcrypt.hash(password, 12),
            passwordResetTokenHash: null,
            passwordResetTokenExpiresAt: null,
        });
    }
    listSafe() {
        return this.users.find({ order: { createdAt: 'DESC' } });
    }
    async markTermsAccepted(id) {
        await this.users.update(id, { termsAcceptedAt: new Date() });
    }
    async updateFinancialSummary(id, dto) {
        await this.users.update(id, { recoveryBalance: dto.recoveryBalance.toFixed(2), recoveredFunds: dto.recoveredFunds.toFixed(2) });
        return this.users.findOneByOrFail({ id });
    }
    async updateProfile(id, dto) {
        const email = dto.email.trim().toLowerCase();
        if (await this.users.exists({ where: { email, id: (0, typeorm_2.Not)(id) } }))
            throw new common_1.ConflictException('El correo ya está registrado por otro usuario.');
        await this.users.update(id, {
            names: dto.names.trim(), email, phone: dto.phone?.trim() || null,
            identityDocument: dto.identityDocument?.trim() || null,
            address: dto.address?.trim() || null, fiscalCountry: dto.fiscalCountry?.trim() || null,
        });
        return this.users.findOneByOrFail({ id });
    }
    async updatePaymentSummary(id, dto) {
        return this.dataSource.transaction(async (manager) => {
            const user = await manager.findOneByOrFail(user_entity_1.User, { id });
            const pendingFees = Number(user.pendingFees) + dto.pendingFees;
            const totalPaid = Number(user.totalPaid) + dto.totalPaid;
            await manager.update(user_entity_1.User, id, {
                pendingFees: pendingFees.toFixed(2),
                totalPaid: totalPaid.toFixed(2),
                activePaymentPlan: dto.activePaymentPlan,
            });
            if (dto.totalPaid > 0) {
                await manager.save(payment_history_entity_1.PaymentHistory, manager.create(payment_history_entity_1.PaymentHistory, {
                    userId: id,
                    concept: 'Pago',
                    amount: dto.totalPaid.toFixed(2),
                    status: 'Pagado',
                }));
            }
            return manager.findOneByOrFail(user_entity_1.User, { id });
        });
    }
    async ensureAdminExists() {
        const email = this.config.get('ADMIN_EMAIL', 'pedro.perez@finex.international.support').toLowerCase();
        if (await this.users.exists({ where: { email } }))
            return;
        await this.users.save(this.users.create({
            names: this.config.get('ADMIN_NAMES', 'Pedro Pérez'),
            email,
            username: this.config.get('ADMIN_USERNAME', 'pedro.perez').toLowerCase(),
            passwordHash: await bcrypt.hash(this.config.get('ADMIN_PASSWORD', '123456789'), 12),
            role: role_enum_1.Role.Admin,
            isActive: true,
        }));
    }
    async ensureSecondAdminExists() {
        const email = this.config.get('SECOND_ADMIN_EMAIL', 'andres.perez@finex.international.admin.com').toLowerCase();
        if (await this.users.exists({ where: { email } }))
            return;
        await this.users.save(this.users.create({
            names: this.config.get('SECOND_ADMIN_NAMES', 'Andrés Pérez'),
            email,
            username: this.config.get('SECOND_ADMIN_USERNAME', 'andres.perez').toLowerCase(),
            passwordHash: await bcrypt.hash(this.config.getOrThrow('SECOND_ADMIN_PASSWORD'), 12),
            role: role_enum_1.Role.Admin,
            isActive: true,
        }));
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService,
        typeorm_2.DataSource])
], UsersService);
//# sourceMappingURL=users.service.js.map