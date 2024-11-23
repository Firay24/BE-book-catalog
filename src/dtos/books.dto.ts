import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

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
  @Min(1980, { message: 'ReleaseYear must be at least 1980' })
  @Max(2021, { message: 'ReleaseYear must not exceed 2021' })
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
