import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CATEGORY } from '@prisma/client';
import { ResponseBookDto, addBookDto, updateBookDto } from './dtos/book.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('book')
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get()
  getHomes(
    @Query('title') title?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('category') category?: CATEGORY,
  ): Promise<ResponseBookDto[]> {
    const price =
      minPrice || maxPrice
        ? {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) }),
          }
        : undefined;

    const filter = {
      ...(title && { title }),
      ...(price && { price }),
      ...(category && { category }),
    };

    return this.bookService.getBooks(filter);
  }

  @Get(':id')
  getBook(@Param('id') id: number) {
    return this.bookService.getBook(id);
  }

  @Post()
  async addBook(@Body() body: addBookDto) {
    const publisher = await this.prismaService.publisher.findUnique({
      where: {
        id: body.id_publisher,
      },
    });

    if (!publisher) {
      throw new NotFoundException('Publisher Not Found');
    }

    const author = await this.prismaService.author.findUnique({
      where: {
        id: body.id_author,
      },
    });

    if (!author) {
      throw new NotFoundException('Author Not Found');
    }

    return this.bookService.addBook(body);
  }

  @Put(':id')
  updateBook(@Body() body: updateBookDto, @Param('id') id: number) {
    return this.bookService.updateBook(id, body);
  }

  @Delete(':id')
  deleteBook(@Param('id') id: number) {
    return this.bookService.deleteBook(id);
  }
}
