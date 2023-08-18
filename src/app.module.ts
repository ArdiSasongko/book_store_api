import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { DataInterceptor } from './interceptor/data.interceptor';
import { AuthGuard } from './guards/auth.guard';
import { PublisherModule } from './publisher/publisher.module';
import { AuthorModule } from './author/author.module';

@Module({
  imports: [PrismaModule, UserModule, BookModule, PublisherModule, AuthorModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: DataInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
