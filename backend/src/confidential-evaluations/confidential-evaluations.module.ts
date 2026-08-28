import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfidentialEvaluation } from './confidential-evaluation.entity';
import { ConfidentialEvaluationsController } from './confidential-evaluations.controller';
import { ConfidentialEvaluationsService } from './confidential-evaluations.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConfidentialEvaluation])],
  controllers: [ConfidentialEvaluationsController],
  providers: [ConfidentialEvaluationsService],
})
export class ConfidentialEvaluationsModule {}
