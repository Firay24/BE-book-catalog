import { BookResponse } from './books.interface';
import { Category, Book } from '@prisma/client';

export interface CategoryResponse {
  id: string;
  name: string;
}

export interface BookByCategoryDb extends Category {
  Book: Book[];
}

export interface BookByCategoryResponse {
  id: string;
  category: string;
  book: BookResponse[];
}
