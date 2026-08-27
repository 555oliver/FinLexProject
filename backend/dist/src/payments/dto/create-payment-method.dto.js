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
exports.CreatePaymentMethodDto = void 0;
const class_validator_1 = require("class-validator");
class CreatePaymentMethodDto {
    cardType;
    cardholderName;
    brand;
    lastFour;
    expiryMonth;
    expiryYear;
}
exports.CreatePaymentMethodDto = CreatePaymentMethodDto;
__decorate([
    (0, class_validator_1.IsIn)(['Crédito', 'Débito']),
    __metadata("design:type", String)
], CreatePaymentMethodDto.prototype, "cardType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], CreatePaymentMethodDto.prototype, "cardholderName", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['Visa', 'Mastercard', 'American Express', 'Otra']),
    __metadata("design:type", String)
], CreatePaymentMethodDto.prototype, "brand", void 0);
__decorate([
    (0, class_validator_1.Matches)(/^\d{4}$/),
    __metadata("design:type", String)
], CreatePaymentMethodDto.prototype, "lastFour", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(12),
    __metadata("design:type", Number)
], CreatePaymentMethodDto.prototype, "expiryMonth", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(2026),
    (0, class_validator_1.Max)(2100),
    __metadata("design:type", Number)
], CreatePaymentMethodDto.prototype, "expiryYear", void 0);
//# sourceMappingURL=create-payment-method.dto.js.map