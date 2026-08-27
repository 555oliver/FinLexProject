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
exports.UserDocument = void 0;
const typeorm_1 = require("typeorm");
let UserDocument = class UserDocument {
    id;
    userId;
    originalName;
    mimeType;
    size;
    data;
    createdAt;
};
exports.UserDocument = UserDocument;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UserDocument.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid' }),
    __metadata("design:type", String)
], UserDocument.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'original_name', length: 255 }),
    __metadata("design:type", String)
], UserDocument.prototype, "originalName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'mime_type', length: 120 }),
    __metadata("design:type", String)
], UserDocument.prototype, "mimeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], UserDocument.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bytea', select: false }),
    __metadata("design:type", Buffer)
], UserDocument.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], UserDocument.prototype, "createdAt", void 0);
exports.UserDocument = UserDocument = __decorate([
    (0, typeorm_1.Entity)({ name: 'user_documents' })
], UserDocument);
//# sourceMappingURL=user-document.entity.js.map