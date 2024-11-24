import { PrismaClient, StatusBook, User } from '@prisma/client';
import { Service } from 'typedi';
import { HttpException } from '@/exceptions/httpException';
import { UpdateBorrowedBookDto } from '@/dtos/borrowedBook.dto';
import { BookBorrowedDb, BorrowedBookResponse, FindBorrowedBook } from '@/interfaces/borrowedBook.interface';

@Service()
export class BorrowedBookService {
  public borrow = new PrismaClient().borrowedBook;
  public user = new PrismaClient().user;
  public book = new PrismaClient().book;

  public async getBorrowedBooksByUserId(userId: string): Promise<BorrowedBookResponse[]> {
    const user = await this.user.findUnique({ where: { Id: userId } });
    if (!user) {
      throw new HttpException(404, 'User not found');
    }

    const borrowedBooks: BookBorrowedDb[] = await this.borrow.findMany({
      where: {
        BorrowRequest: {
          UserId: userId,
        },
      },
      include: {
        BorrowRequest: true,
        Book: { include: { Category: true } },
      },
    });

    const responseData: BorrowedBookResponse[] = borrowedBooks.map((item: BookBorrowedDb) => ({
      id: item.Id,
      borrowRequestId: item.BorrowRequestId,
      startDate: item.StartDate,
      endDate: item.EndDate,
      bookId: item.BookId,
      returnDate: item.ReturnedDate,
      Book: {
        id: item.Book.Id,
        title: item.Book.Title,
        description: item.Book.Description,
        imageUrl: item.Book.ImageUrl,
        releaseYear: item.Book.ReleaseYear,
        price: item.Book.Price,
        totalPage: item.Book.TotalPage,
        thickness: item.Book.Thickness,
        status: item.Book.Status,
        categoryId: item.Book.CategoryId,
        category: item.Book.Category.Name,
      },
    }));

    if (!borrowedBooks.length) {
      throw new HttpException(404, 'No borrowed books found for this user');
    }

    return responseData;
  }

  public async updateBorrowedBook(borrowedBookId: string, borrowedRequestData: UpdateBorrowedBookDto): Promise<BorrowedBookResponse> {
    const findBorrowedBook: FindBorrowedBook = await this.borrow.findUnique({ where: { Id: borrowedBookId }, include: { BorrowRequest: true } });
    if (!findBorrowedBook) throw new HttpException(409, "Borrowed Book doesn't exist");

    const updateRequest = await this.borrow.update({
      where: { Id: borrowedBookId },
      data: {
        ReturnedDate: borrowedRequestData.ReturnedDate,
      },
    });

    await this.book.update({
      where: { Id: findBorrowedBook.BookId },
      data: {
        Status: StatusBook.AVAILABLE,
      },
    });

    if (borrowedRequestData.ReturnedDate > findBorrowedBook.EndDate) {
      const findUser: User = await this.user.findUnique({ where: { Id: findBorrowedBook.BorrowRequest.UserId } });
      if (!findUser) throw new HttpException(409, "User doesn't exist");

      const banUntil = new Date(borrowedRequestData.ReturnedDate);
      banUntil.setMonth(banUntil.getMonth() + 1);

      await this.user.update({
        where: { Id: findUser.Id },
        data: {
          BanUntil: banUntil,
        },
      });
    }

    const borrowedBookResponse: BorrowedBookResponse = {
      id: updateRequest.Id,
      borrowRequestId: updateRequest.BorrowRequestId,
      startDate: updateRequest.StartDate,
      endDate: updateRequest.EndDate,
      bookId: updateRequest.BookId,
      returnDate: updateRequest.ReturnedDate,
    };

    return borrowedBookResponse;
  }
}
