import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { CategoryService } from '@/services/categories.service';
import { CategoryResponse } from '@/interfaces/categories.interface';
import { UpdateCategoryDto } from '@/dtos/categories.dto';

export class CategoryController {
  public category = Container.get(CategoryService);

  public getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllCategoriesData: CategoryResponse[] = await this.category.findAllCategory();

      res.status(200).json({ data: findAllCategoriesData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoryId = String(req.params.id);
      const findOneCategoryData: CategoryResponse = await this.category.findCategoryById(categoryId);

      res.status(200).json({ data: findOneCategoryData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoryData: UpdateCategoryDto = req.body;
      const createCategoryData: CategoryResponse = await this.category.createCategory(categoryData);

      res.status(201).json({ data: createCategoryData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoryId = String(req.params.id);
      const categoryData: UpdateCategoryDto = req.body;
      const updateCategoryData: CategoryResponse = await this.category.updateCategory(categoryId, categoryData);

      res.status(200).json({ data: updateCategoryData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoryId = String(req.params.id);
      const deleteCategoryData: CategoryResponse = await this.category.deleteCategory(categoryId);

      res.status(200).json({ data: deleteCategoryData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
