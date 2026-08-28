import { Transform } from 'class-transformer';
import { IsEmail, MaxLength } from 'class-validator';

export class CreateConfidentialEvaluationDto {
  @Transform(({ value }) => typeof value === 'string' ? value.trim().toLowerCase() : value)
  @IsEmail({}, { message: 'Ingrese un correo electrónico válido.' })
  @MaxLength(254)
  email: string;
}
