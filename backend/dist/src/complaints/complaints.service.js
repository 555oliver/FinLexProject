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
exports.ComplaintsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const complaint_entity_1 = require("./complaint.entity");
const complaint_status_enum_1 = require("./complaint-status.enum");
let ComplaintsService = class ComplaintsService {
    complaints;
    constructor(complaints) {
        this.complaints = complaints;
    }
    create(userId, dto, file) {
        return this.complaints.save(this.complaints.create({
            userId,
            reason: dto.reason,
            description: dto.description.trim(),
            status: complaint_status_enum_1.ComplaintStatus.InReview,
            attachmentName: file?.originalname ?? null,
            attachmentMimeType: file?.mimetype ?? null,
            attachmentSize: file?.size ?? null,
            attachmentData: file?.buffer ?? null,
        }));
    }
    listForUser(userId) {
        return this.complaints.find({ where: { userId }, order: { createdAt: 'DESC' } });
    }
    async listAll() {
        const complaints = await this.complaints.find({ relations: { user: true }, order: { createdAt: 'DESC' } });
        return complaints.map(complaint => ({
            id: complaint.id,
            reason: complaint.reason,
            description: complaint.description,
            status: complaint.status,
            attachmentName: complaint.attachmentName,
            createdAt: complaint.createdAt,
            updatedAt: complaint.updatedAt,
            user: { id: complaint.user.id, names: complaint.user.names, email: complaint.user.email },
        }));
    }
    async updateStatus(id, status) {
        await this.complaints.update(id, { status });
        return this.complaints.findOneByOrFail({ id });
    }
};
exports.ComplaintsService = ComplaintsService;
exports.ComplaintsService = ComplaintsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(complaint_entity_1.Complaint)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ComplaintsService);
//# sourceMappingURL=complaints.service.js.map