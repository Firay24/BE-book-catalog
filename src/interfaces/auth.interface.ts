import { Request } from 'express';
import { UserAuth } from '@interfaces/users.interface';

export interface DataStoredInToken {
  id: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: UserAuth;
}
