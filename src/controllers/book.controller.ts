import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { BookService } from '@/services/books.service';
import { BookResponse } from '@/interfaces/books.interface';
import { UpdateBooksDto } from '@/dtos/books.dto';

export class BookController {
  public book = Container.get(BookService);

  public getBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllBooksData: BookResponse[] = await this.book.findAllBook();

      res.status(200).json({ data: findAllBooksData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getBookById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bookId = String(req.params.id);
      const findOneBookData: BookResponse = await this.book.findBookById(bookId);

      res.status(200).json({ data: findOneBookData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bookData: UpdateBooksDto = req.body;
      const createBookData: BookResponse = await this.book.createBook(bookData);

      res.status(201).json({ data: createBookData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bookId = String(req.params.id);
      const bookData: UpdateBooksDto = req.body;
      const updateBookData: BookResponse = await this.book.updateBook(bookId, bookData);

      res.status(200).json({ data: updateBookData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bookId = String(req.params.id);
      const deleteBookData: BookResponse = await this.book.deleteBook(bookId);

      res.status(200).json({ data: deleteBookData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
