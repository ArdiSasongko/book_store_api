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
  book: string;

  @Expose({ name: 'List Books' })
  listBook() {
    return this.book;
  }

  constructor(partial: Partial<ResponseAuthorDto>) {
    Object.assign(this, partial);
  }
}
