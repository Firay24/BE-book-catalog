import { PrismaClient, Category } from '@prisma/client';
import { Service } from 'typedi';
import { UpdateCategoryDto } from '@/dtos/categories.dto';
import { HttpException } from '@/exceptions/httpException';
import { generateId } from '@/utils/generateId';
import { CategoryResponse, BookByCategoryResponse, BookByCategoryDb } from '@/interfaces/categories.interface';

@Service()
export class CategoryService {
  public category = new PrismaClient().category;

  public async findAllCategory(): Promise<CategoryResponse[]> {
    const categoryDB: Category[] = await this.category.findMany();
    const categoryData: CategoryResponse[] = categoryDB.map((user: Category) => {
      return {
        id: user.Id,
        name: user.Name,
      };
    });
    return categoryData;
  }

  public async findCategoryById(categoryId: string): Promise<CategoryResponse> {
    const findCategory: Category = await this.category.findUnique({ where: { Id: categoryId } });
    if (!findCategory) throw new HttpException(409, "Category doesn't exist");

    const userData: CategoryResponse = {
      id: findCategory.Id,
      name: findCategory.Name,
    };
    return userData;
  }

  public async bookByCategoryId(categoryId: string): Promise<BookByCategoryResponse> {
    const findCategory: BookByCategoryDb = await this.category.findUnique({ where: { Id: categoryId }, include: { Book: true } });
    if (!findCategory) throw new HttpException(409, "Category doesn't exist");

    const bookByCategoryResponse: BookByCategoryResponse = {
      id: findCategory.Id,
      category: findCategory.Name,
      book: findCategory.Book.map(book => {
        return {
          id: book.Id,
          title: book.Title,
          description: book.Description,
          imageUrl: book.ImageUrl,
          releaseYear: book.ReleaseYear,
          price: book.Price,
          totalPage: book.TotalPage,
          thickness: book.Thickness,
          categoryId: book.CategoryId,
        };
      }),
    };

    return bookByCategoryResponse;
  }

  public async createCategory(categoryData: UpdateCategoryDto): Promise<CategoryResponse> {
    const findCategory: Category = await this.category.findFirst({ where: { Name: categoryData.Name.toLowerCase() } });
    if (findCategory) throw new HttpException(409, `This email ${categoryData.Name} already exists`);

    const createCategoryData = await this.category.create({
      data: {
        Id: generateId(),
        Name: categoryData.Name.toLowerCase(),
      },
    });

    const categoryDataResponse: CategoryResponse = {
      id: createCategoryData.Id,
      name: createCategoryData.Name,
    };
    return categoryDataResponse;
  }

  public async updateCategory(categoryId: string, userData: UpdateCategoryDto): Promise<CategoryResponse> {
    const findCategory: Category = await this.category.findUnique({ where: { Id: categoryId } });
    if (!findCategory) throw new HttpException(409, "Category doesn't exist");

    const updateCategoryData = await this.category.update({ where: { Id: categoryId }, data: { ...userData } });

    const categoryDataResponse: CategoryResponse = {
      id: updateCategoryData.Id,
      name: updateCategoryData.Name,
    };
    return categoryDataResponse;
  }

  public async deleteCategory(categoryId: string): Promise<CategoryResponse> {
    const findCategory: Category = await this.category.findUnique({ where: { Id: categoryId } });
    if (!findCategory) throw new HttpException(409, "Category doesn't exist");

    const deleteCategoryData = await this.category.delete({ where: { Id: categoryId } });

    const categoryDataResponse: CategoryResponse = {
      id: deleteCategoryData.Id,
      name: deleteCategoryData.Name,
    };
    return categoryDataResponse;
  }
}
