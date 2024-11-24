import { PrismaClient, BorrowRequest, RequestStatus, StatusBook, User, Book } from '@prisma/client';
import { Service } from 'typedi';
import { generateId } from '@/utils/generateId';
import { BorrowRequestDto, UpdateBorrowRequestDto } from '@/dtos/borrowRequest.dto';
import { BookRequestByUserResponse, BorrowRequestDb, BorrowResponse } from '@/interfaces/borrowRequest';
import { HttpException } from '@/exceptions/httpException';

@Service()
export class BorrowRequestService {
  public request = new PrismaClient().borrowRequest;
  public borrow = new PrismaClient().borrowedBook;
  public book = new PrismaClient().book;
  public user = new PrismaClient().user;

  public async findAllBookByUserId(userId: string): Promise<BookRequestByUserResponse[]> {
    const findUser: User = await this.user.findUnique({ where: { Id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const findBorrowRequest: BorrowRequestDb[] = await this.request.findMany({
      where: { UserId: userId },
      include: { Book: { include: { Category: true } } },
    });

    const borrowRequestResponse: BookRequestByUserResponse[] = findBorrowRequest.map((borrowRequest: BorrowRequestDb) => ({
      id: borrowRequest.Id,
      userId: borrowRequest.UserId,
      bookId: borrowRequest.BookId,
      status: borrowRequest.Status,
      days: borrowRequest.Days,
      requestDate: borrowRequest.RequestDate,
      approvedDate: borrowRequest.Approved,
      book: {
        id: borrowRequest.Book.Id,
        title: borrowRequest.Book.Title,
        description: borrowRequest.Book.Description,
        imageUrl: borrowRequest.Book.ImageUrl,
        releaseYear: borrowRequest.Book.ReleaseYear,
        price: borrowRequest.Book.Price,
        totalPage: borrowRequest.Book.TotalPage,
        thickness: borrowRequest.Book.Thickness,
        categoryId: borrowRequest.Book.CategoryId,
        category: borrowRequest.Book.Category.Name,
      },
    }));

    return borrowRequestResponse;
  }

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
