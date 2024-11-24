import { Book, BorrowRequest, Category, RequestStatus } from '@prisma/client';
import { BookResponse } from './books.interface';

export interface BorrowResponse {
  id: string;
  userId: string;
  bookId: string;
  status: RequestStatus;
  requestDate: Date;
  approvedDate: Date;
}

export interface BookDb extends Book {
  Category: Category;
}

export interface BorrowRequestDb extends BorrowRequest {
  Book: BookDb;
}

export interface BookRequestByUserResponse {
  id: string;
  userId: string;
  bookId: string;
  status: RequestStatus;
  days: number;
  requestDate: Date;
  approvedDate: Date;
  book: BookResponse;
}
