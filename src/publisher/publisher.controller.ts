import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PublisherService } from './publisher.service';
import {
  ResponsePublisherDto,
  addPublisherDto,
  editPublisherDto,
} from './dtos/publisher.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Roles } from 'src/decorators/roles.decorator';
import { UserType } from '@prisma/client';

@Controller('publisher')
export class PublisherController {
  constructor(
    private readonly publisherService: PublisherService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get()
  getPublishers(
    @Query('name') name?: string,
    @Query('location') location?: string,
  ): Promise<ResponsePublisherDto[]> {
    const filter = {
      ...(name && { name }),
      ...(location && { location }),
    };
    return this.publisherService.getPublishers(filter);
  }

  @Get(':id')
  getPublisher(@Param('id') id: number) {
    return this.publisherService.getPublisher(id);
  }

  @Roles(UserType.ADMIN)
  @Post()
  async addPublisher(@Body() body: addPublisherDto) {
    const findPublisher = await this.prismaService.publisher.findUnique({
      where: { name: body.name },
    });

    if (findPublisher) {
      throw new HttpException('Name already used', 409);
    }

    const findEmail = await this.prismaService.publisher.findUnique({
      where: { email: body.email },
    });

    if (findEmail) {
      throw new HttpException('email already used', 409);
    }

    return this.publisherService.addPublisher(body);
  }

  @Roles(UserType.ADMIN)
  @Put(':id')
  async updatePublisher(
    @Param('id') id: number,
    @Body() body: editPublisherDto,
  ) {
    return this.publisherService.updatePublisher(id, body);
  }

  @Roles(UserType.ADMIN)
  @Delete(':id')
  deletePublisher(@Param('id') id: number) {
    return this.publisherService.deletePublisher(id);
  }
}
