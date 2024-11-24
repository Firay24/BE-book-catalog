import { PrismaClient, BorrowRequest, RequestStatus, StatusBook, User, Book } from '@prisma/client';
import { Service } from 'typedi';
import { generateId } from '@/utils/generateId';
import { BorrowRequestDto, UpdateBorrowRequestDto } from '@/dtos/borrowRequest.dto';
import { BorrowResponse } from '@/interfaces/borrowRequest';
import { HttpException } from '@/exceptions/httpException';

@Service()
export class BorrowRequestService {
  public request = new PrismaClient().borrowRequest;
  public borrow = new PrismaClient().borrowedBook;
  public book = new PrismaClient().book;
  public user = new PrismaClient().user;

  public async createBorrowRequest(borrowRequestData: BorrowRequestDto): Promise<BorrowResponse> {
    const findUser: User = await this.user.findUnique({ where: { Id: borrowRequestData.UserId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");
    if (findUser.BanUntil > new Date()) throw new HttpException(409, 'User is banned');

    const findBook: Book = await this.book.findUnique({ where: { Id: borrowRequestData.BookId } });
    if (!findBook) throw new HttpException(409, "Book doesn't exist");
    if (findBook.Status === StatusBook.BORROWED) throw new HttpException(409, 'Book is borrowed');

    const createBorrowRequestData: BorrowRequest = await this.request.create({
      data: {
        Id: generateId(),
        UserId: borrowRequestData.UserId,
        BookId: borrowRequestData.BookId,
        Status: RequestStatus.PENDING,
        Days: borrowRequestData.Days,
      },
    });

    const borrowRequestResponse: BorrowResponse = {
      id: createBorrowRequestData.Id,
      userId: createBorrowRequestData.UserId,
      bookId: createBorrowRequestData.BookId,
      status: createBorrowRequestData.Status,
      requestDate: createBorrowRequestData.RequestDate,
      approvedDate: createBorrowRequestData.Approved,
    };

    return borrowRequestResponse;
  }

  public async updateBorrowRequestStatus(borrowRequestId: string, borrowRequestData: UpdateBorrowRequestDto): Promise<BorrowResponse> {
    const findRequest: BorrowRequest = await this.request.findUnique({ where: { Id: borrowRequestId } });
    if (!findRequest) throw new HttpException(409, "Borrow Request doesn't exist");

    const updateRequest = await this.request.update({
      where: { Id: borrowRequestId },
      data: {
        Status: borrowRequestData.Status,
        Approved: new Date(),
      },
    });

    if (borrowRequestData.Status === RequestStatus.ACCEPTED) {
      await this.borrow.create({
        data: {
          Id: generateId(),
          BorrowRequestId: borrowRequestId,
          StartDate: new Date(),
          EndDate: new Date(new Date().setDate(new Date().getDate() + findRequest.Days)),
          BookId: findRequest.BookId,
        },
      });
      await this.book.update({
        where: { Id: findRequest.BookId },
        data: {
          Status: StatusBook.BORROWED,
        },
      });
    }

    const borrowRequestResponse: BorrowResponse = {
      id: updateRequest.Id,
      userId: updateRequest.UserId,
      bookId: updateRequest.BookId,
      status: updateRequest.Status,
      requestDate: updateRequest.RequestDate,
      approvedDate: updateRequest.Approved,
    };

    return borrowRequestResponse;
  }
}
