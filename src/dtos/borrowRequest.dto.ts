import { RequestStatus } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class BorrowRequestDto {
  @IsString()
  @IsNotEmpty()
  public UserId: string;

  @IsString()
  @IsNotEmpty()
  public BookId: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(7)
  public Days: number;
}

export class UpdateBorrowRequestDto {
  @IsString()
  @IsNotEmpty()
  public Status: RequestStatus;
}
