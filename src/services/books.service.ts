import { PrismaClient, Book, RequestStatus } from '@prisma/client';
import { Service } from 'typedi';
import { HttpException } from '@/exceptions/httpException';
import { generateId } from '@/utils/generateId';
import { BookCategoryDb, BookResponse } from '@/interfaces/books.interface';
import { UpdateBooksDto } from '@/dtos/books.dto';
import DetermineThickness from '@/utils/thickness';

@Service()
export class BookService {
  public book = new PrismaClient().book;

  public async findAllBook(): Promise<BookResponse[]> {
    const bookDB: BookCategoryDb[] = await this.book.findMany({ include: { Category: true, BorrowRequest: true } });
    const bookData: BookResponse[] = bookDB.map((item: BookCategoryDb) => {
      return {
        id: item.Id,
        title: item.Title,
        description: item.Description,
        imageUrl: item.ImageUrl,
        releaseYear: item.ReleaseYear,
        price: item.Price,
        totalPage: item.TotalPage,
        thickness: item.Thickness,
        categoryId: item.CategoryId,
        category: item.Category.Name,
        request: item.BorrowRequest.some(request => request.Status === RequestStatus.PENDING),
      };
    });
    return bookData;
  }

  public async findBookById(bookId: string): Promise<BookResponse> {
    const findBook: Book = await this.book.findUnique({ where: { Id: bookId } });
    if (!findBook) throw new HttpException(409, "Book doesn't exist");

    const bookData: BookResponse = {
      id: findBook.Id,
      title: findBook.Title,
      description: findBook.Description,
      imageUrl: findBook.ImageUrl,
      releaseYear: findBook.ReleaseYear,
      price: findBook.Price,
      totalPage: findBook.TotalPage,
      thickness: findBook.Thickness,
      categoryId: findBook.CategoryId,
    };
    return bookData;
  }

  public async createBook(bookData: UpdateBooksDto): Promise<BookResponse> {
    const findBook: Book = await this.book.findFirst({ where: { Title: bookData.Title.toLowerCase() } });
    if (findBook) throw new HttpException(409, `This ${bookData.Title} already exists`);
    const thicknessValue = DetermineThickness(bookData.TotalPage);

    const createbookData = await this.book.create({
      data: {
        Id: generateId(),
        Title: bookData.Title.toLowerCase(),
        Description: bookData.Description,
        ImageUrl: bookData.ImageUrl,
        ReleaseYear: bookData.ReleaseYear,
        Price: bookData.Price,
        TotalPage: bookData.TotalPage,
        Thickness: thicknessValue,
        CategoryId: bookData.CategoryId,
      },
    });

    const bookDataResponse: BookResponse = {
      id: createbookData.Id,
      title: createbookData.Title,
      description: createbookData.Description,
      imageUrl: createbookData.ImageUrl,
      releaseYear: createbookData.ReleaseYear,
      price: createbookData.Price,
      totalPage: createbookData.TotalPage,
      thickness: createbookData.Thickness,
      categoryId: createbookData.CategoryId,
    };
    return bookDataResponse;
  }

  public async updateBook(bookId: string, bookData: UpdateBooksDto): Promise<BookResponse> {
    const findBook: Book = await this.book.findUnique({ where: { Id: bookId } });
    if (!findBook) throw new HttpException(409, "Book doesn't exist");
    const thicknessValue = DetermineThickness(bookData.TotalPage);

    const updateBookData = await this.book.update({
      where: { Id: bookId },
      data: {
        Id: generateId(),
        Title: bookData.Title.toLowerCase(),
        Description: bookData.Description,
        ImageUrl: bookData.ImageUrl,
        ReleaseYear: bookData.ReleaseYear,
        Price: bookData.Price,
        TotalPage: bookData.TotalPage,
        Thickness: thicknessValue,
        CategoryId: bookData.CategoryId,
      },
    });

    const bookDataResponse: BookResponse = {
      id: updateBookData.Id,
      title: updateBookData.Title,
      description: updateBookData.Description,
      imageUrl: updateBookData.ImageUrl,
      releaseYear: updateBookData.ReleaseYear,
      price: updateBookData.Price,
      totalPage: updateBookData.TotalPage,
      thickness: updateBookData.Thickness,
      categoryId: updateBookData.CategoryId,
    };
    return bookDataResponse;
  }

  public async deleteBook(bookId: string): Promise<BookResponse> {
    const findBook: Book = await this.book.findUnique({ where: { Id: bookId } });
    if (!findBook) throw new HttpException(409, "Book doesn't exist");

    const deleteBookData = await this.book.delete({ where: { Id: bookId } });

    const bookDataResponse: BookResponse = {
      id: deleteBookData.Id,
      title: deleteBookData.Title,
      description: deleteBookData.Description,
      imageUrl: deleteBookData.ImageUrl,
      releaseYear: deleteBookData.ReleaseYear,
      price: deleteBookData.Price,
      totalPage: deleteBookData.TotalPage,
      thickness: deleteBookData.Thickness,
      categoryId: deleteBookData.CategoryId,
    };
    return bookDataResponse;
  }
}
