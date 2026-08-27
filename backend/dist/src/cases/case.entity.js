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
exports.CaseRecord = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
let CaseRecord = class CaseRecord {
    id;
    userId;
    user;
    caseNumber;
    currentPhase;
    createdAt;
    updatedAt;
};
exports.CaseRecord = CaseRecord;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CaseRecord.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid' }),
    __metadata("design:type", String)
], CaseRecord.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], CaseRecord.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)({ name: 'case_number', type: 'varchar', length: 30, unique: true }),
    __metadata("design:type", String)
], CaseRecord.prototype, "caseNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'current_phase', type: 'smallint', default: 0 }),
    __metadata("design:type", Number)
], CaseRecord.prototype, "currentPhase", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], CaseRecord.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], CaseRecord.prototype, "updatedAt", void 0);
exports.CaseRecord = CaseRecord = __decorate([
    (0, typeorm_1.Entity)({ name: 'cases' })
], CaseRecord);
//# sourceMappingURL=case.entity.js.map