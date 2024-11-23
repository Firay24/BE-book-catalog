import { PrismaClient, User } from '@prisma/client';
import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@/exceptions/httpException';
import { UserResponse } from '@interfaces/users.interface';
import { generateId } from '@/utils/generateId';

@Service()
export class UserService {
  public user = new PrismaClient().user;

  public async findAllUser(): Promise<UserResponse[]> {
    const userDB: User[] = await this.user.findMany();
    const userData: UserResponse[] = userDB.map((user: User) => {
      return {
        id: user.Id,
        email: user.Email,
        password: user.Password,
        name: user.Name,
        roleId: user.RoleId,
      };
    });
    return userData;
  }

  public async findUserById(userId: string): Promise<UserResponse> {
    const findUser: User = await this.user.findUnique({ where: { Id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const userData: UserResponse = {
      id: findUser.Id,
      email: findUser.Email,
      password: findUser.Password,
      name: findUser.Name,
      roleId: findUser.RoleId,
    };
    return userData;
  }

  public async createUser(userData: CreateUserDto): Promise<UserResponse> {
    const findUser: User = await this.user.findUnique({ where: { Email: userData.Email } });
    if (findUser) throw new HttpException(409, `This email ${userData.Email} already exists`);

    const hashedPassword = await hash(userData.Password, 10);
    const createUserData = await this.user.create({
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
      password: createUserData.Password,
      name: createUserData.Name,
      roleId: createUserData.RoleId,
    };
    return userDataResponse;
  }

  public async updateUser(userId: string, userData: CreateUserDto): Promise<UserResponse> {
    const findUser: User = await this.user.findUnique({ where: { Id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const hashedPassword = await hash(userData.Password, 10);
    const updateUserData = await this.user.update({ where: { Id: userId }, data: { ...userData, Password: hashedPassword } });

    const userDataResponse: UserResponse = {
      id: updateUserData.Id,
      email: updateUserData.Email,
      password: updateUserData.Password,
      name: updateUserData.Name,
      roleId: updateUserData.RoleId,
    };
    return userDataResponse;
  }

  public async deleteUser(userId: string): Promise<UserResponse> {
    const findUser: User = await this.user.findUnique({ where: { Id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const deleteUserData = await this.user.delete({ where: { Id: userId } });

    const userDataResponse: UserResponse = {
      id: deleteUserData.Id,
      email: deleteUserData.Email,
      password: deleteUserData.Password,
      name: deleteUserData.Name,
      roleId: deleteUserData.RoleId,
    };
    return userDataResponse;
  }
}
