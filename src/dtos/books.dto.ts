import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateBooksDto {
  @IsString()
  @IsNotEmpty()
  public Title: string;

  @IsString()
  @IsNotEmpty()
  public Description: string;

  @IsString()
  public ImageUrl: string;

  @IsNumber()
  @IsNotEmpty()
  public ReleaseYear: number;

  @IsNumber()
  @IsNotEmpty()
  public Price: number;

  @IsNumber()
  @IsNotEmpty()
  public TotalPage: number;

  @IsString()
  @IsNotEmpty()
  public CategoryId: string;
}
