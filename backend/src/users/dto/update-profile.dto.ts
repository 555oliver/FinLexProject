import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @IsString() @MinLength(2) @MaxLength(150) names: string;
  @IsEmail() @MaxLength(180) email: string;
  @IsOptional() @IsString() @MaxLength(30) phone?: string;
  @IsOptional() @IsString() @MaxLength(50) identityDocument?: string;
  @IsOptional() @IsString() @MaxLength(255) address?: string;
  @IsOptional() @IsString() @MaxLength(100) fiscalCountry?: string;
}
