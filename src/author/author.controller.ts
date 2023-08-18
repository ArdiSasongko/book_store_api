import { Controller, Get, Query, Param, Body } from '@nestjs/common';
import { AuthorService } from './author.service';
import { ResponseAuthorDto } from './dtos/author.dto';

@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Get()
  getAuthors(
    @Query('name') name?: string,
    @Query('pen_name') pen_name?: string,
  ): Promise<ResponseAuthorDto[]> {
    const filter = {
      ...(name && { name }),
      ...(pen_name && { pen_name }),
    };

    return this.authorService.getAuthors(filter);
  }

  @Get(':id')
  getAuthor(@Param('id') id: number) {
    return this.authorService.getAuthor(id);
  }
}
