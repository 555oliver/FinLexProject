import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ConfidentialEvaluation } from './confidential-evaluation.entity';
import {
  ACTIVE_CONFIDENTIAL_EVALUATION_STATUSES,
  ConfidentialEvaluationStatus,
} from './confidential-evaluation-status.enum';

@Injectable()
export class ConfidentialEvaluationsService {
  constructor(
    @InjectRepository(ConfidentialEvaluation)
    private readonly evaluations: Repository<ConfidentialEvaluation>,
  ) {}

  async create(emailValue: string): Promise<ConfidentialEvaluation> {
    const email = emailValue.trim().toLowerCase();
    const existing = await this.evaluations.findOne({
      where: { email, status: In(ACTIVE_CONFIDENTIAL_EVALUATION_STATUSES) },
    });

    if (existing) throw this.activeEvaluationConflict();

    try {
      return await this.evaluations.save(this.evaluations.create({
        email,
        status: ConfidentialEvaluationStatus.Requested,
      }));
    } catch (error) {
      if (this.isUniqueViolation(error)) throw this.activeEvaluationConflict();
      throw error;
    }
  }

  listAll(): Promise<ConfidentialEvaluation[]> {
    return this.evaluations.find({ order: { createdAt: 'DESC' } });
  }

  async updateStatus(id: string, status: ConfidentialEvaluationStatus): Promise<ConfidentialEvaluation> {
    const evaluation = await this.evaluations.findOneBy({ id });
    if (!evaluation) throw new NotFoundException('La evaluación confidencial no existe.');
    if (ACTIVE_CONFIDENTIAL_EVALUATION_STATUSES.includes(status)) {
      const otherActive = await this.evaluations.findOne({
        where: { email: evaluation.email, status: In(ACTIVE_CONFIDENTIAL_EVALUATION_STATUSES) },
      });
      if (otherActive && otherActive.id !== evaluation.id) throw this.activeEvaluationConflict();
    }
    evaluation.status = status;
    try {
      return await this.evaluations.save(evaluation);
    } catch (error) {
      if (this.isUniqueViolation(error)) throw this.activeEvaluationConflict();
      throw error;
    }
  }

  private activeEvaluationConflict(): ConflictException {
    return new ConflictException('Este correo ya tiene una evaluación confidencial en proceso.');
  }

  private isUniqueViolation(error: unknown): boolean {
    return typeof error === 'object' && error !== null && 'code' in error && error.code === '23505';
  }
}
