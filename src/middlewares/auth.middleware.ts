import { PrismaClient } from '@prisma/client';
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import { UserAuth } from '@/interfaces/users.interface';
import { Role } from '@/interfaces/roles.interface';

const getAuthorization = req => {
  const coockie = req.cookies['Authorization'];
  if (coockie) return coockie;

  const header = req.header('Authorization');
  if (header) return header.split('Bearer ')[1];

  return null;
};

export const AuthMiddleware = (allowedRoles: Role[]) => {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const Authorization = getAuthorization(req);

      if (Authorization) {
        const { id } = (await verify(Authorization, SECRET_KEY)) as DataStoredInToken;
        const prisma = new PrismaClient();
        const findUser = await prisma.user.findUnique({ where: { Id: String(id) }, include: { Role: true } });

        if (findUser) {
          const findUserResponse: UserAuth = {
            id: findUser.Id,
            email: findUser.Email,
            name: findUser.Name,
            roleId: findUser.RoleId,
          };

          // Assign user details to the request
          req.user = findUserResponse;

          // Check if user role is allowed
          if (allowedRoles.includes(findUser.Role.Name as Role)) {
            next();
          } else {
            next(new HttpException(403, 'Forbidden: Insufficient permissions'));
          }
        } else {
          next(new HttpException(401, 'Wrong authentication token'));
        }
      } else {
        next(new HttpException(404, 'Authentication token missing'));
      }
    } catch (error) {
      next(new HttpException(401, 'Wrong authentication token'));
    }
  };
};
// export const AuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
//   try {
//     const Authorization = getAuthorization(req);

//     if (Authorization) {
//       const { id } = (await verify(Authorization, SECRET_KEY)) as DataStoredInToken;
//       const users = new PrismaClient().user;
//       const findUser = await users.findUnique({ where: { Id: String(id) } });

//       const findUserResponse: UserAuth = {
//         id: findUser.Id,
//         email: findUser.Email,
//         name: findUser.Name,
//         roleId: findUser.RoleId,
//       };

//       if (findUser) {
//         req.user = findUserResponse;
//         next();
//       } else {
//         next(new HttpException(401, 'Wrong authentication token'));
//       }
//     } else {
//       next(new HttpException(404, 'Authentication token missing'));
//     }
//   } catch (error) {
//     next(new HttpException(401, 'Wrong authentication token'));
//   }
// };
