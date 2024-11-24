import { RequestStatus } from '@prisma/client';

export interface BorrowResponse {
  id: string;
  userId: string;
  bookId: string;
  status: RequestStatus;
  requestDate: Date;
  approvedDate: Date;
}
