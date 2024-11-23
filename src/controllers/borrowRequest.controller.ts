import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { BorrowResponse } from '@/interfaces/borrowRequest';
import { BorrowRequestDto, UpdateBorrowRequestDto } from '@/dtos/borrowRequest.dto';
import { BorrowRequestService } from '@/services/borrowRequest.service';

export class BorrowRequestController {
  public request = Container.get(BorrowRequestService);

  public createBorrowRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const requestData: BorrowRequestDto = req.body;
      const createRequestData: BorrowResponse = await this.request.createBorrowRequest(requestData);

      res.status(201).json({ data: createRequestData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateBorrowRequestStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const requestId = String(req.params.id);
      const requestData: UpdateBorrowRequestDto = req.body;
      const updateRequestData: BorrowResponse = await this.request.updateBorrowRequestStatus(requestId, requestData);

      res.status(200).json({ data: updateRequestData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };
}
