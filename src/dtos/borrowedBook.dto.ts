import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class UpdateBorrowedBookDto {
  @IsDate()
  @IsNotEmpty()
  public ReturnedDate: Date;
}
