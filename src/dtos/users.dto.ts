import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public Email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  public Password: string;

  @IsString()
  @IsNotEmpty()
  public Name: string;

  @IsString()
  @IsNotEmpty()
  public RoleId: string;
}

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  public password: string;
}

export class LoginUserDto {
  @IsEmail()
  public Email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  public Password: string;
}
