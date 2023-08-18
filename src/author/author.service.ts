import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseAuthorDto } from './dtos/author.dto';

interface responseAuthor {
  name?: string;
  pen_name?: string;
}
@Injectable()
export class AuthorService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAuthors(filter: responseAuthor): Promise<ResponseAuthorDto[]> {
    const author = await this.prismaService.author.findMany({
      select: {
        pen_name: true,
        name: true,
      },
      where: filter,
    });

    if (!author.length) {
      throw new NotFoundException();
    }

    return author.map((author) => {
      const fetchAuthor = { ...author };
      return new ResponseAuthorDto(fetchAuthor);
    });
  }

  async getAuthor(id: number) {
    const author = await this.prismaService.author.findUnique({
      select: {
        pen_name: true,
        name: true,
        email: true,
        books: {
          select: {
            title: true,
          },
        },
      },
      where: {
        id,
      },
    });

    if (!author) {
      throw new NotFoundException();
    }

    return new ResponseAuthorDto(author);
  }
}
