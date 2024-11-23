import { Router } from 'express';
import { CategoryController } from '@/controllers/categories.controller';
import { UpdateCategoryDto } from '@/dtos/categories.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { Role } from '@/interfaces/roles.interface';

export class CategoryRoute implements Routes {
  public path = '/categories';
  public router = Router();
  public category = new CategoryController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware([Role.ADMIN, Role.MEMBER]), this.category.getCategories);
    this.router.get(`${this.path}/:id([A-Za-z0-9]+)`, AuthMiddleware([Role.ADMIN, Role.MEMBER]), this.category.getCategoryById);
    this.router.post(`${this.path}`, AuthMiddleware([Role.ADMIN]), ValidationMiddleware(UpdateCategoryDto), this.category.createCategory);
    this.router.put(
      `${this.path}/:id([A-Za-z0-9]+)`,
      AuthMiddleware([Role.ADMIN]),
      ValidationMiddleware(UpdateCategoryDto, true),
      this.category.updateCategory,
    );
    this.router.delete(`${this.path}/:id([A-Za-z0-9]+)`, AuthMiddleware([Role.ADMIN]), this.category.deleteCategory);
  }
}
