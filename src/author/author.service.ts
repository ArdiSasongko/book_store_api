import { Injectable } from '@nestjs/common';

interface responseAuthor {
  name?: string;
  pen_name?: string;
}
@Injectable()
export class AuthorService {}
