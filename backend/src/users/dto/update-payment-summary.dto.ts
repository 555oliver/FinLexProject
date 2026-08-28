import { IsIn, IsNumber, Max, Min } from 'class-validator';

export class UpdatePaymentSummaryDto {
  @IsNumber({ maxDecimalPlaces: 2 }) @Min(-999999999999.99) @Max(999999999999.99) pendingFees: number;
  @IsNumber({ maxDecimalPlaces: 2 }) @Min(-999999999999.99) @Max(999999999999.99) totalPaid: number;
  @IsIn(['Pagado', 'Anulado', 'Rechazado', 'Pendiente']) activePaymentPlan: string;
}
