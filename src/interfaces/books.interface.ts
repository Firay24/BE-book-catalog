import { Book, BorrowRequest, Category } from '@prisma/client';

export interface BookResponse {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  releaseYear: number;
  price: number;
  totalPage: number;
  thickness: string;
  categoryId: string;
  category?: string;
  request?: boolean;
}

export interface BookCategoryDb extends Book {
  Category: Category;
  BorrowRequest: BorrowRequest[];
}
