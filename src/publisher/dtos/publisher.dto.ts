import { Exclude, Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class ResponsePublisherDto {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;

  @Exclude()
  book: string;

  @Expose({ name: 'List Book' })
  listBook() {
    return this.book;
  }

  constructor(partial: Partial<ResponsePublisherDto>) {
    Object.assign(this, partial);
  }
}

export class addPublisherDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @Matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, {
    message: 'phone must be valid phone number',
  })
  phone: string;

  @IsNotEmpty()
  @IsString()
  location: string;
}

export class editPublisherDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @Matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, {
    message: 'phone must be valid phone number',
  })
  phone: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  location: string;
}
