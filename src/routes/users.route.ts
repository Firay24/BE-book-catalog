import { Router } from 'express';
import { UserController } from '@controllers/users.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { Role } from '@/interfaces/roles.interface';

export class UserRoute implements Routes {
  public path = '/users';
  public router = Router();
  public user = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware([Role.ADMIN, Role.MEMBER]), this.user.getUsers);
    this.router.get(`${this.path}/:id([A-Za-z0-9]+)`, AuthMiddleware([Role.ADMIN, Role.MEMBER]), this.user.getUserById);
    this.router.post(`${this.path}`, AuthMiddleware([Role.ADMIN]), ValidationMiddleware(CreateUserDto), this.user.createUser);
    this.router.put(`${this.path}/:id([A-Za-z0-9]+)`, AuthMiddleware([Role.ADMIN]), ValidationMiddleware(CreateUserDto, true), this.user.updateUser);
    this.router.delete(`${this.path}/:id([A-Za-z0-9]+)`, AuthMiddleware([Role.ADMIN]), this.user.deleteUser);
  }
}
