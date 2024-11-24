import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { BorrowedBookService } from '@/services/borrowedBook.service';
import { UpdateBorrowedBookDto } from '@/dtos/borrowedBook.dto';
import { BorrowedBookResponse } from '@/interfaces/borrowedBook.interface';

export class BorrowedBookController {
  public borrow = Container.get(BorrowedBookService);

  public updateBorrowedBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const borrowId = String(req.params.id);
      const borrowData: UpdateBorrowedBookDto = req.body;
      const updateBorrowedData: BorrowedBookResponse = await this.borrow.updateBorrowedBook(borrowId, borrowData);

      res.status(200).json({ data: updateBorrowedData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public getBorrowedBookByUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = String(req.params.id);
      const bookBorrowedData: BorrowedBookResponse[] = await this.borrow.getBorrowedBooksByUserId(userId);

      res.status(200).json({ data: bookBorrowedData, message: 'find all' });
    } catch (error) {
      next(error);
    }
  };
}
