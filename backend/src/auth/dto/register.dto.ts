import { Equals, IsBoolean, IsEmail, IsNotEmpty, IsString, Length, Matches, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString() @IsNotEmpty() @MaxLength(150) names: string;
  @IsEmail() @MaxLength(180) email: string;
  @IsString() @MinLength(4) @MaxLength(80) @Matches(/^[a-zA-Z0-9._-]+$/) username: string;
  @IsString() @MinLength(8) @MaxLength(72) password: string;
  @IsString() @Length(2, 2) countryCode: string;
  @IsString() @Matches(/^\+[0-9]{1,7}$/) dialCode: string;
  @IsString() @Matches(/^[0-9\s-]{6,18}$/) phone: string;
  @IsBoolean() @Equals(true, { message: 'Debe aceptar los términos y condiciones.' }) termsAccepted: boolean;
}
