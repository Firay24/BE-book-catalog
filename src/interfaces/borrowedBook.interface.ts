import { Book, BorrowedBook, BorrowRequest, Category } from '@prisma/client';
import { BookResponse } from './books.interface';

export interface BorrowedBookResponse {
  id: string;
  borrowRequestId: string;
  startDate: Date;
  endDate: Date;
  bookId: string;
  returnDate: string | Date;
  Book?: BookResponse;
}

export interface FindBorrowedBook extends BorrowedBook {
  BorrowRequest: BorrowRequest | null;
}

export interface BookDb extends Book {
  Category: Category;
}

export interface BorrowedBookDb extends BorrowedBook {
  Book: Book;
}

export interface BookBorrowedDb extends BorrowedBook {
  BorrowRequest: BorrowRequest;
  Book: BookDb;
}
