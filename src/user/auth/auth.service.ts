import { Injectable, ConflictException, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

interface createAccount {
  name: string;
  email: string;
  password: string;
}

interface loginAccount {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async createAccount(
    { name, email, password }: createAccount,
    userType: UserType,
  ) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      throw new ConflictException();
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await this.prismaService.user.create({
      data: {
        name,
        email,
        password: hashPassword,
        userType,
      },
    });

    return newUser;
  }

  async loginAccount({ email, password }: loginAccount) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new HttpException('Invalid Email', 400);
    }

    const hashPassword = user.password;

    const isValidPassword = await bcrypt.compare(password, hashPassword);

    if (!isValidPassword) {
      throw new HttpException('Invalid Password', 400);
    }

    return this.generateJWT(user.id, user.name);
  }

  private async generateJWT(id: number, name: string) {
    return jwt.sign(
      {
        id,
        name,
      },
      process.env.JSON_KEY,
      {
        expiresIn: 3600,
      },
    );
  }

  generateProductKey(email: string, userType: UserType) {
    const string = `${email}-${userType}-${process.env.PRODUCT_KEY}`;

    return bcrypt.hash(string, 10);
  }
}
