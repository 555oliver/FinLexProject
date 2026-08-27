import { IsInt, Max, Min } from 'class-validator';

export class UpdateCasePhaseDto {
  @IsInt() @Min(0) @Max(5) currentPhase: number;
}
