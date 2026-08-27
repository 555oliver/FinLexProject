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
exports.Complaint = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const complaint_status_enum_1 = require("./complaint-status.enum");
let Complaint = class Complaint {
    id;
    userId;
    user;
    reason;
    description;
    status;
    attachmentName;
    attachmentMimeType;
    attachmentSize;
    attachmentData;
    createdAt;
    updatedAt;
};
exports.Complaint = Complaint;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Complaint.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid' }),
    __metadata("design:type", String)
], Complaint.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Complaint.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 120 }),
    __metadata("design:type", String)
], Complaint.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Complaint.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, default: complaint_status_enum_1.ComplaintStatus.InReview }),
    __metadata("design:type", String)
], Complaint.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'attachment_name', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], Complaint.prototype, "attachmentName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'attachment_mime_type', type: 'varchar', length: 120, nullable: true }),
    __metadata("design:type", Object)
], Complaint.prototype, "attachmentMimeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'attachment_size', type: 'integer', nullable: true }),
    __metadata("design:type", Object)
], Complaint.prototype, "attachmentSize", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'attachment_data', type: 'bytea', nullable: true, select: false }),
    __metadata("design:type", Object)
], Complaint.prototype, "attachmentData", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], Complaint.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], Complaint.prototype, "updatedAt", void 0);
exports.Complaint = Complaint = __decorate([
    (0, typeorm_1.Entity)({ name: 'complaints' })
], Complaint);
//# sourceMappingURL=complaint.entity.js.map