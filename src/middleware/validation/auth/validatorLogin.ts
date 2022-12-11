import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

import { CustomError } from '../../../utils/response/custom-error/CustomError';
import { ErrorValidation } from '../../../utils/response/custom-error/types';

export const validatorLogin = (req: Request, res: Response, next: NextFunction) => {
  const { password, email } = req.body;
  const errorsValidation: ErrorValidation[] = [];

  if (typeof email != 'string' || !validator.isEmail(email)) {
    errorsValidation.push({ email: 'Not a valid email format' });
  }

  if (validator.isEmpty(password)) {
    errorsValidation.push({ password: 'Password field is required' });
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(400, 'Validation', 'Login validation error', null, null, errorsValidation);
    return next(customError);
  }
  return next();
};
