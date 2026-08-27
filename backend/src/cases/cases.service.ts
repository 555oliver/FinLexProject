import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { Repository } from 'typeorm';
import { CaseRecord } from './case.entity';
import { CASE_PHASES } from './case-phases';

@Injectable()
export class CasesService {
  constructor(@InjectRepository(CaseRecord) private readonly cases: Repository<CaseRecord>) {}

  async create(userId: string) {
    const activeCase = await this.cases.createQueryBuilder('case')
      .where('case.userId = :userId', { userId })
      .andWhere('case.currentPhase < :completedPhase', { completedPhase: CASE_PHASES.length - 1 })
      .getExists();
    if (activeCase) throw new ConflictException('Ya tiene un caso activo. Debe finalizarlo antes de crear otro.');
    const year = new Date().getFullYear();
    const caseNumber = `LF-${year}-${randomBytes(3).toString('hex').toUpperCase()}`;
    return this.toResponse(await this.cases.save(this.cases.create({ userId, caseNumber, currentPhase: 0 })));
  }

  async findForUser(userId: string) {
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

  async updatePhase(id: string, currentPhase: number) {
    await this.cases.update(id, { currentPhase });
    return this.toResponse(await this.cases.findOneByOrFail({ id }));
  }

  private toResponse(caseRecord: CaseRecord) {
    return {
      id: caseRecord.id,
      caseNumber: caseRecord.caseNumber,
      currentPhase: caseRecord.currentPhase,
      currentPhaseName: CASE_PHASES[caseRecord.currentPhase],
      progress: Math.round(((caseRecord.currentPhase + 1) / CASE_PHASES.length) * 100),
      createdAt: caseRecord.createdAt,
      updatedAt: caseRecord.updatedAt,
    };
  }
}
