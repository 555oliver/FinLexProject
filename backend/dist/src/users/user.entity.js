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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const role_enum_1 = require("./role.enum");
let User = class User {
    id;
    names;
    email;
    username;
    passwordHash;
    phone;
    countryCode;
    dialCode;
    role;
    isActive;
    termsAcceptedAt;
    recoveryBalance;
    recoveredFunds;
    pendingFees;
    totalPaid;
    activePaymentPlan;
    identityDocument;
    address;
    fiscalCountry;
    emailVerifiedAt;
    verificationTokenHash;
    verificationTokenExpiresAt;
    passwordResetTokenHash;
    passwordResetTokenExpiresAt;
    createdAt;
    updatedAt;
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 150 }),
    __metadata("design:type", String)
], User.prototype, "names", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 180 }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 80 }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password_hash', length: 255, select: false }),
    __metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'country_code', type: 'varchar', length: 2, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "countryCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'dial_code', type: 'varchar', length: 8, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "dialCode", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'enum', enum: role_enum_1.Role, enumName: 'user_role', default: role_enum_1.Role.User }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'terms_accepted_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "termsAcceptedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'recovery_balance', type: 'numeric', precision: 14, scale: 2, default: 0 }),
    __metadata("design:type", String)
], User.prototype, "recoveryBalance", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'recovered_funds', type: 'numeric', precision: 14, scale: 2, default: 0 }),
    __metadata("design:type", String)
], User.prototype, "recoveredFunds", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pending_fees', type: 'numeric', precision: 14, scale: 2, default: 0 }),
    __metadata("design:type", String)
], User.prototype, "pendingFees", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_paid', type: 'numeric', precision: 14, scale: 2, default: 0 }),
    __metadata("design:type", String)
], User.prototype, "totalPaid", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'active_payment_plan', type: 'varchar', length: 100, default: 'Pendiente' }),
    __metadata("design:type", String)
], User.prototype, "activePaymentPlan", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'identity_document', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "identityDocument", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fiscal_country', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "fiscalCountry", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email_verified_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "emailVerifiedAt", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'verification_token_hash', type: 'varchar', length: 64, nullable: true, select: false }),
    __metadata("design:type", Object)
], User.prototype, "verificationTokenHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'verification_token_expires_at', type: 'timestamptz', nullable: true, select: false }),
    __metadata("design:type", Object)
], User.prototype, "verificationTokenExpiresAt", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'password_reset_token_hash', type: 'varchar', length: 64, nullable: true, select: false }),
    __metadata("design:type", Object)
], User.prototype, "passwordResetTokenHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password_reset_token_expires_at', type: 'timestamptz', nullable: true, select: false }),
    __metadata("design:type", Object)
], User.prototype, "passwordResetTokenExpiresAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)({ name: 'users' })
], User);
//# sourceMappingURL=user.entity.js.map