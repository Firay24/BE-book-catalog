import { PrismaClient, User } from '@prisma/client';
import { Service } from 'typedi';
import { HttpException } from '@/exceptions/httpException';
import { UpdateBorrowedBookDto } from '@/dtos/borrowedBook.dto';
import { BorrowedBookResponse, FindBorrowedBook } from '@/interfaces/borrowedBook.interface';

@Service()
export class BorrowedBookService {
  public borrow = new PrismaClient().borrowedBook;
  public user = new PrismaClient().user;

  public async updateBorrowedBook(borrowedBookId: string, borrowedRequestData: UpdateBorrowedBookDto): Promise<BorrowedBookResponse> {
    const findBorrowedBook: FindBorrowedBook = await this.borrow.findUnique({ where: { Id: borrowedBookId }, include: { BorrowRequest: true } });
    if (!findBorrowedBook) throw new HttpException(409, "Borrowed Book doesn't exist");

    const updateRequest = await this.borrow.update({
      where: { Id: borrowedBookId },
      data: {
        ReturnedDate: borrowedRequestData.ReturnedDate,
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
