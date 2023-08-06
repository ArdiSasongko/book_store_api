import { Injectable, NotFoundException, HttpException } from '@nestjs/common';
import { CATEGORY } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseBookDto } from './dtos/book.dto';

interface BooksFilter {
  title?: string;
  price: {
    gte?: number;
    lte?: number;
  };
  category?: CATEGORY;
}

interface addBook {
  category: CATEGORY;
  title: string;
  description: string;
  price: number;
  amount: number;
  id_publisher: number;
  id_author: number;
}

interface updateBook {
  category?: CATEGORY;
  title?: string;
  description?: string;
  price?: number;
  amount?: number;
  id_publisher?: number;
  id_author?: number;
}

const BookSelect = {
  id: true,
  category: true,
  title: true,
  description: true,
  price: true,
};

@Injectable()
export class BookService {
  constructor(private readonly prismaService: PrismaService) {}

  async getBooks(filter: BooksFilter): Promise<ResponseBookDto[]> {
    const books = await this.prismaService.book.findMany({
      select: {
        ...BookSelect,
      },
      where: filter,
    });

    if (!books.length) {
      throw new NotFoundException();
    }

    return books.map((books) => {
      const fetchBook = { ...books };
      return new ResponseBookDto(fetchBook);
    });
  }

  async getBook(id: number) {
    const book = await this.prismaService.book.findUnique({
      select: {
        ...BookSelect,
        publish_date: true,
        update_date: true,
        publisher: {
          select: {
            name: true,
            email: true,
            location: true,
          },
        },
        author: {
          select: {
            pen_name: true,
            email: true,
          },
        },
      },
      where: {
        id: id,
      },
    });

    if (!book) {
      throw new NotFoundException();
    }

    return new ResponseBookDto(book);
  }

  async addBook({
    category,
    title,
    description,
    price,
    amount,
    id_publisher,
    id_author,
  }: addBook) {
    const newBook = await this.prismaService.book.create({
      data: {
        category,
        title,
        description,
        price,
        amount,
        id_publisher,
        id_author,
      },
    });

    return new ResponseBookDto(newBook);
  }

  async updateBook(id: number, data: updateBook) {
    const findBook = await this.prismaService.book.findUnique({
      where: {
        id,
      },
    });

    if (!findBook) {
      throw new NotFoundException();
    }

    const updateBook = await this.prismaService.book.update({
      where: {
        id,
      },
      data,
    });

    return new ResponseBookDto(updateBook);
  }

  async deleteBook(id: number) {
    const findBook = await this.prismaService.book.findUnique({
      where: {
        id,
      },
    });

    if (!findBook) {
      throw new NotFoundException();
    }

    const deleteBook = await this.prismaService.book.delete({
      where: {
        id,
      },
    });

    throw new HttpException(`Success Delete ${findBook.title}`, 202);
  }
}
