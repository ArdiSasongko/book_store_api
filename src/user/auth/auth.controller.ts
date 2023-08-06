import {
  Controller,
  Post,
  Body,
  Param,
  ParseEnumPipe,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserType } from '@prisma/client';
import {
  GeneratedProductDto,
  createAccountDto,
  loginAccountDto,
} from '../dtos/user.dto';
import * as bcrypt from 'bcrypt';

@Controller('auth/:userType')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async createAccount(
    @Body() body: createAccountDto,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ) {
    if (userType === UserType.ADMIN) {
      if (!body.product_key) {
        throw new HttpException('Need Product Key', 400);
      }

      const validProductKey = `${body.email}-${userType}-${process.env.PRODUCT_KEY}`;

      const isValidProductKey = await bcrypt.compare(
        validProductKey,
        body.product_key,
      );

      if (!isValidProductKey) {
        throw new HttpException('Invalid Product Key', 400);
      }
    }

    return this.authService.createAccount(body, userType);
  }

  @Post('signin')
  loginAccount(@Body() body: loginAccountDto) {
    return this.authService.loginAccount(body);
  }

  @Post('/key')
  generateProductKey(@Body() { userType, email }: GeneratedProductDto) {
    return this.authService.generateProductKey(email, userType);
  }
}
