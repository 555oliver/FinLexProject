import { IsIn, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateComplaintDto {
  @IsString()
  @IsIn(['Consulta sobre mi caso', 'Problema con un pago', 'Queja sobre la atención', 'Información adicional'])
  reason: string;

  @IsString()
  @MinLength(10)
  @MaxLength(3000)
  description: string;
}
