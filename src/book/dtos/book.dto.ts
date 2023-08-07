import { CATEGORY } from '@prisma/client';
import { Expose, Exclude } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class ResponseBookDto {
  id: number;
  category: CATEGORY;
  title: string;
  description: string;
  price: number;
  amount: number;

  @Exclude()
  publish_date: Date;

  @Expose({ name: 'Publish Date' })
  publishDate() {
    return this.publish_date;
  }

  @Exclude()
  update_date: Date;

  @Expose({ name: 'Updated Date' })
  updateDate() {
    return this.update_date;
  }

  @Exclude()
  id_publisher: number;

  @Exclude()
  id_author: number;

  @Exclude()
  buyer: string;

  constructor(partial: Partial<ResponseBookDto>) {
    Object.assign(this, partial);
  }
}

export class addBookDto {
  @IsEnum(CATEGORY)
  @IsNotEmpty()
  category: CATEGORY;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount: number;

  @IsNumber()
  @IsNotEmpty()
  id_publisher: number;

  @IsNumber()
  @IsNotEmpty()
  id_author: number;
}

export class updateBookDto {
  @IsOptional()
  @IsEnum(CATEGORY)
  @IsNotEmpty()
  category: CATEGORY;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  id_publisher: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  id_author: number;
}

export class buyBookDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;
}
