import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { UserType } from '@prisma/client';

export class createAccountDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  product_key: string;
}

export class loginAccountDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class GeneratedProductDto {
  @IsEmail()
  email: string;

  @IsEnum(UserType)
  userType: UserType;
}
