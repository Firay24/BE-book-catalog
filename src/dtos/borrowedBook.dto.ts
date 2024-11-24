import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class UpdateBorrowedBookDto {
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  public ReturnedDate: Date;
}
