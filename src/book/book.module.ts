import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BookController],
  providers: [
    BookService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class BookModule {}
