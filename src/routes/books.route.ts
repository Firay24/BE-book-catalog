import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { BookController } from '@/controllers/book.controller';
import { UpdateBooksDto } from '@/dtos/books.dto';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { Role } from '@/interfaces/roles.interface';

export class BookRoute implements Routes {
  public path = '/books';
  public router = Router();
  public book = new BookController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware([Role.ADMIN, Role.MEMBER]), this.book.getBooks);
    this.router.get(`${this.path}/:id([A-Za-z0-9]+)`, AuthMiddleware([Role.ADMIN, Role.MEMBER]), this.book.getBookById);
    this.router.post(`${this.path}`, AuthMiddleware([Role.ADMIN]), ValidationMiddleware(UpdateBooksDto), this.book.createBook);
    this.router.put(`${this.path}/:id([A-Za-z0-9]+)`, AuthMiddleware([Role.ADMIN]), ValidationMiddleware(UpdateBooksDto, true), this.book.updateBook);
    this.router.delete(`${this.path}/:id([A-Za-z0-9]+)`, AuthMiddleware([Role.ADMIN]), this.book.deleteBook);
  }
}
