import { BorrowedBook, BorrowRequest } from '@prisma/client';

export interface BorrowedBookResponse {
  id: string;
  borrowRequestId: string;
  startDate: Date;
  endDate: Date;
  bookId: string;
  returnDate: Date;
}

export interface FindBorrowedBook extends BorrowedBook {
  BorrowRequest: BorrowRequest | null;
}
