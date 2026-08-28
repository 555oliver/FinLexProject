import { IsEnum } from 'class-validator';
import { ConfidentialEvaluationStatus } from '../confidential-evaluation-status.enum';

export class UpdateConfidentialEvaluationStatusDto {
  @IsEnum(ConfidentialEvaluationStatus)
  status: ConfidentialEvaluationStatus;
}
