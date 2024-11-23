import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { BorrowRequestController } from '@/controllers/borrowRequest.controller';
import { BorrowRequestDto, UpdateBorrowRequestDto } from '@/dtos/borrowRequest.dto';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { Role } from '@/interfaces/roles.interface';

export class BorrowRequestRoute implements Routes {
  public path = '/book/request';
  public router = Router();
  public request = new BorrowRequestController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}`,
      AuthMiddleware([Role.ADMIN, Role.MEMBER]),
      ValidationMiddleware(BorrowRequestDto),
      this.request.createBorrowRequest,
    );
    this.router.put(
      `${this.path}/:id([A-Za-z0-9]+)`,
      AuthMiddleware([Role.ADMIN]),
      ValidationMiddleware(UpdateBorrowRequestDto, true),
      this.request.updateBorrowRequestStatus,
    );
  }
}
