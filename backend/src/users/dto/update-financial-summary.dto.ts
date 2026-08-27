import { IsNumber, Max, Min } from 'class-validator';

export class UpdateFinancialSummaryDto {
  @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) @Max(999999999999.99) recoveryBalance: number;
  @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) @Max(999999999999.99) recoveredFunds: number;
}
