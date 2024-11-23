import { PrismaClient, User } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { Service } from 'typedi';
import { SECRET_KEY } from '@config';
import { CreateUserDto, LoginUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { UserResponse } from '@interfaces/users.interface';
import { generateId } from '@/utils/generateId';

@Service()
export class AuthService {
  public users = new PrismaClient().user;

  public async signup(userData: CreateUserDto): Promise<UserResponse> {
    const findUser: User = await this.users.findUnique({ where: { Email: userData.Email } });
    if (findUser) throw new HttpException(409, `This email ${userData.Email} already exists`);

    const hashedPassword = await hash(userData.Password, 10);
    const createUserData = await this.users.create({
      data: {
        Id: generateId(),
        Email: userData.Email,
        Name: userData.Name,
        RoleId: userData.RoleId,
        Password: hashedPassword,
      },
    });

    const userDataResponse: UserResponse = {
      id: createUserData.Id,
      email: createUserData.Email,
      name: createUserData.Name,
      roleId: createUserData.RoleId,
    };

    return userDataResponse;
  }

  public async login(userData: LoginUserDto): Promise<{ cookie: string; findUser: UserResponse }> {
    const findUser: User = await this.users.findUnique({ where: { Email: userData.Email } });
    if (!findUser) throw new HttpException(409, `This email ${userData.Email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.Password, findUser.Password);
    if (!isPasswordMatching) throw new HttpException(409, 'Password is not matching');

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);

    const userDataResponse: UserResponse = {
      id: findUser.Id,
      email: findUser.Email,
      name: findUser.Name,
      roleId: findUser.RoleId,
    };

    return { cookie, findUser: userDataResponse };
  }

  public async getCurrentUser(token: string): Promise<UserResponse> {
    try {
      // Verifikasi token
      const { id } = verify(token, SECRET_KEY) as DataStoredInToken;

      // Cari user berdasarkan ID dari token
      const findUser: User = await this.users.findUnique({ where: { Id: id } });
      if (!findUser) throw new HttpException(404, 'User not found');

      // Buat response user
      const userDataResponse: UserResponse = {
        id: findUser.Id,
        email: findUser.Email,
        name: findUser.Name,
        roleId: findUser.RoleId,
      };

      return userDataResponse;
    } catch (error) {
      throw new HttpException(401, 'Invalid or expired token');
    }
  }

  public async logout(userData: LoginUserDto): Promise<UserResponse> {
    const findUser: User = await this.users.findFirst({ where: { Email: userData.Email, Password: userData.Password } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const userDataResponse: UserResponse = {
      id: findUser.Id,
      email: findUser.Email,
      name: findUser.Name,
      roleId: findUser.RoleId,
    };
    return userDataResponse;
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.Id };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}
