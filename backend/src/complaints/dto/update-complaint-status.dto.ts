import { IsEnum } from 'class-validator';
import { ComplaintStatus } from '../complaint-status.enum';

export class UpdateComplaintStatusDto {
  @IsEnum(ComplaintStatus) status: ComplaintStatus;
}
