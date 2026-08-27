import { IsIn, IsInt, IsString, Matches, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreatePaymentMethodDto {
  @IsIn(['Crédito', 'Débito']) cardType: string;
  @IsString() @MinLength(3) @MaxLength(150) cardholderName: string;
  @IsIn(['Visa', 'Mastercard', 'American Express', 'Otra']) brand: string;
  @Matches(/^\d{4}$/) lastFour: string;
  @IsInt() @Min(1) @Max(12) expiryMonth: number;
  @IsInt() @Min(2026) @Max(2100) expiryYear: number;
}
