import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser } from '@interfaces/auth.interface';
import { UserResponse } from '@interfaces/users.interface';
import { AuthService } from '@services/auth.service';
import { CreateUserDto, LoginUserDto } from '@/dtos/users.dto';
import { HttpException } from '@/exceptions/httpException';

export class AuthController {
  public auth = Container.get(AuthService);

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const signUpUserData: UserResponse = await this.auth.signup(userData);

      res.status(201).json({ data: signUpUserData, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: LoginUserDto = req.body;
      const { cookie, findUser } = await this.auth.login(userData);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ cookie, data: findUser, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  public getCurrentUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.Authorization || req.header('Authorization')?.split('Bearer ')[1];
      if (!token) throw new HttpException(401, 'Authentication token missing');

      const user = await this.auth.getCurrentUser(token);
      res.status(200).json({ data: user, message: 'current user' });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: any = req.user;
      const logOutUserData: UserResponse = await this.auth.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };
}
