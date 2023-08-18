import { Exclude, Expose } from 'class-transformer';

export class ResponseAuthorDto {
  id: number;

  @Exclude()
  pen_name: string;

  @Expose({ name: 'Pen Name' })
  penName() {
    return this.pen_name;
  }

  name: string;
  email: string;

  @Exclude()
  books: string;

  @Expose({ name: 'List Books' })
  listBook() {
    return this.books;
  }
}
