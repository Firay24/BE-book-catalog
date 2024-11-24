import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { BorrowedBookController } from '@/controllers/borrowedBook.controller';
import { UpdateBorrowedBookDto } from '@/dtos/borrowedBook.dto';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { Role } from '@/interfaces/roles.interface';

export class BorrowedBookRoute implements Routes {
  public path = '/book/borrowed';
  public router = Router();
  public borrow = new BorrowedBookController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.put(
      `${this.path}/:id([A-Za-z0-9]+)`,
      AuthMiddleware([Role.ADMIN, Role.MEMBER]),
      ValidationMiddleware(UpdateBorrowedBookDto, true),
      this.borrow.updateBorrowedBook,
    );
  }
}
