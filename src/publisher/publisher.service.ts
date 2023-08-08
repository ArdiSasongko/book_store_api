import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponsePublisherDto } from './dtos/publisher.dto';

interface publisherFilter {
  name?: string;
  location?: string;
}

interface addPublisher {
  name: string;
  email: string;
  phone: string;
  location: string;
}

interface updatePublisher {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
}

const publisherSelect = {
  name: true,
  email: true,
  location: true,
};

@Injectable()
export class PublisherService {
  constructor(private readonly prismaService: PrismaService) {}

  async getPublishers(
    filter: publisherFilter,
  ): Promise<ResponsePublisherDto[]> {
    const publisher = await this.prismaService.publisher.findMany({
      select: {
        ...publisherSelect,
      },
      where: filter,
    });

    if (!publisher.length) {
      throw new NotFoundException();
    }

    return publisher.map((publisher) => {
      const fetchPublisher = { ...publisher };
      return new ResponsePublisherDto(fetchPublisher);
    });
  }

  async getPublisher(id: number) {
    const publisher = await this.prismaService.publisher.findUnique({
      select: {
        id: true,
        ...publisherSelect,
        phone: true,
        books: {
          select: {
            title: true,
            price: true,
          },
        },
      },
      where: {
        id,
      },
    });

    if (!publisher) {
      throw new NotFoundException();
    }

    return new ResponsePublisherDto(publisher);
  }

  async addPublisher({ name, email, phone, location }: addPublisher) {
    const publisher = await this.prismaService.publisher.create({
      data: {
        name,
        email,
        phone,
        location,
      },
    });

    return publisher;
  }

  async updatePublisher(id: number, data: updatePublisher) {
    const findPublisher = await this.prismaService.publisher.findUnique({
      where: {
        id,
      },
    });

    if (!findPublisher) {
      throw new NotFoundException();
    }

    const updatePublisher = await this.prismaService.publisher.update({
      where: {
        id,
      },
      data,
    });

    return new ResponsePublisherDto(updatePublisher);
  }

  async deletePublisher(id: number) {
    const deletePublisher = await this.prismaService.publisher.delete({
      where: { id },
    });

    throw new HttpException(
      `Success Delete Publisher ${deletePublisher.name}`,
      202,
    );
  }
}
