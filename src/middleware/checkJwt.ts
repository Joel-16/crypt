import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { JwtPayload } from '../utils/createJwtToken';
import { CustomError } from '../utils/response/custom-error/CustomError';

export const checkUserJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const customError = new CustomError(400, 'General', 'Authorization header not provided');
    return next(customError);
  }

  const token = authHeader.split(' ')[1];
  let jwtPayload: { [key: string]: any };
  try {
    jwtPayload = jwt.verify(token, process.env.USER_JWT_SECRET as string) as { [key: string]: any };
    req.jwtPayload = jwtPayload as JwtPayload;
    next();
  } catch (err) {
    return next(new CustomError(401, 'Raw', 'Invalid Token, please login again'));
  }
};

export const checkStaffJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const customError = new CustomError(400, 'General', 'Authorization header not provided');
    return next(customError);
  }

  const token = authHeader.split(' ')[1];
  let jwtPayload: { [key: string]: any };
  try {
    jwtPayload = jwt.verify(token, process.env.STAFF_JWT_SECRET as string) as { [key: string]: any };
    req.jwtPayload = jwtPayload as JwtPayload;
    switch (req.baseUrl) {
      case '/hr':
        if (req.jwtPayload.role != 'HR') {
          return next(
            new CustomError(401, 'Raw', 'JWT error', ["You don't have authorisation to access this resource"]),
          );
        }
        break;
      case '/crm':
        if (req.jwtPayload.role != 'CRM') {
          return next(
            new CustomError(401, 'Raw', 'JWT error', ["You don't have authorisation to access this resource"]),
          );
        }
        break;
      case '/operations':
        if (req.jwtPayload.role != 'OPERATIONS') {
          return next(
            new CustomError(401, 'Raw', 'JWT error', ["You don't have authorisation to access this resource"]),
          );
        }
        break;
      case '/warehouse':
        switch (req.path) {
          case '/add-warehouse':
            if (req.jwtPayload.role != 'HEAD-WAREHOUSE') {
              return next(
                new CustomError(401, 'Raw', 'JWT error', ["You don't have authorisation to access this resource"]),
              );
            }
            break;
          case '/dashboard':
            if (req.jwtPayload.role != 'HEAD-WAREHOUSE') {
              return next(
                new CustomError(401, 'Raw', 'JWT error', ["You don't have authorisation to access this resource"]),
              );
            }
            break;
          case '/location':
            if (req.jwtPayload.role != 'HEAD-WAREHOUSE') {
              return next(
                new CustomError(401, 'Raw', 'JWT error', ["You don't have authorisation to access this resource"]),
              );
            }
            break;
          case '/name':
            if (req.jwtPayload.role != 'HEAD-WAREHOUSE') {
              return next(
                new CustomError(401, 'Raw', 'JWT error', ["You don't have authorisation to access this resource"]),
              );
            }
            break;
          default:
            if (!['HEAD-WAREHOUSE', 'WAREHOUSE'].includes(req.jwtPayload.role)) {
              return next(
                new CustomError(401, 'Raw', 'JWT error', ["You don't have authorisation to access this resource"]),
              );
            }
        }
        break;
    }
    next();
  } catch (err) {
    const customError = new CustomError(401, 'Raw', 'JWT error', null, err);
    return next(customError);
  }
};
