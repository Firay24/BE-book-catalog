import { PrismaClient, BorrowRequest, RequestStatus, StatusBook } from '@prisma/client';
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

  public async createBorrowRequest(borrowRequestData: BorrowRequestDto): Promise<BorrowResponse> {
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
      approved: createBorrowRequestData.Approved,
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
      approved: updateRequest.Approved,
    };

    return borrowRequestResponse;
  }
}
