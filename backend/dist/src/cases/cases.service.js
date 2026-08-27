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
exports.CasesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const crypto_1 = require("crypto");
const typeorm_2 = require("typeorm");
const case_entity_1 = require("./case.entity");
const case_phases_1 = require("./case-phases");
let CasesService = class CasesService {
    cases;
    constructor(cases) {
        this.cases = cases;
    }
    async create(userId) {
        const activeCase = await this.cases.createQueryBuilder('case')
            .where('case.userId = :userId', { userId })
            .andWhere('case.currentPhase < :completedPhase', { completedPhase: case_phases_1.CASE_PHASES.length - 1 })
            .getExists();
        if (activeCase)
            throw new common_1.ConflictException('Ya tiene un caso activo. Debe finalizarlo antes de crear otro.');
        const year = new Date().getFullYear();
        const caseNumber = `LF-${year}-${(0, crypto_1.randomBytes)(3).toString('hex').toUpperCase()}`;
        return this.toResponse(await this.cases.save(this.cases.create({ userId, caseNumber, currentPhase: 0 })));
    }
    async findForUser(userId) {
        const cases = await this.cases.find({ where: { userId }, order: { createdAt: 'DESC' } });
        return cases.map(caseRecord => this.toResponse(caseRecord));
    }
    async listAll() {
        const cases = await this.cases.find({ relations: { user: true }, order: { createdAt: 'DESC' } });
        return cases.map(caseRecord => ({
            ...this.toResponse(caseRecord),
            user: { id: caseRecord.user.id, names: caseRecord.user.names, email: caseRecord.user.email },
        }));
    }
    async updatePhase(id, currentPhase) {
        await this.cases.update(id, { currentPhase });
        return this.toResponse(await this.cases.findOneByOrFail({ id }));
    }
    toResponse(caseRecord) {
        return {
            id: caseRecord.id,
            caseNumber: caseRecord.caseNumber,
            currentPhase: caseRecord.currentPhase,
            currentPhaseName: case_phases_1.CASE_PHASES[caseRecord.currentPhase],
            progress: Math.round(((caseRecord.currentPhase + 1) / case_phases_1.CASE_PHASES.length) * 100),
            createdAt: caseRecord.createdAt,
            updatedAt: caseRecord.updatedAt,
        };
    }
};
exports.CasesService = CasesService;
exports.CasesService = CasesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(case_entity_1.CaseRecord)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CasesService);
//# sourceMappingURL=cases.service.js.map