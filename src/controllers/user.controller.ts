import { Response, Request, NextFunction } from 'express';
import { Service } from 'typedi';
import validator from 'validator';

import UserService from '../services/user.services';
import { CustomError } from '../utils/response/custom-error/CustomError';

@Service()
class UserController {
  constructor(private readonly userService: UserService) {}
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.customSuccess(200, await this.userService.login(req.body, next));
    } catch {
      next();
    }
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.customSuccess(200, await this.userService.register(req.body, next));
    } catch {
      next();
    }
  };

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.customSuccess(200, await this.userService.getProfile(req.jwtPayload, next));
    } catch {
      next();
    }
  };

  editProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.email) {
        if (!validator.isEmail(req.body.email)) {
          next(new CustomError(400, 'Validation', 'Invalid Email format'));
        }
      }

    } catch {
      next();
    }
  };


  delele = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.customSuccess(200, await this.userService.delete(req.body.email));
    } catch {
      next();
    }
  };

  all = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.customSuccess(200, await this.userService.all());
    } catch {
      next();
    }
  };

}

export default UserController;
