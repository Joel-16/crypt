import { Request, Response, NextFunction } from 'express';

import { CustomError } from '../utils/response/custom-error/CustomError';
import { ErrorValidation } from '../utils/response/custom-error/types';

export const transferValidation = (req: Request, res: Response, next: NextFunction) => {
  const { amount, pin, accountNo, bankCode, description } = req.body;
  const errorsValidation: ErrorValidation[] = [];

  if (isNaN(amount)) {
    errorsValidation.push({ amount: 'amount field is required or is not a valid number' });
  }

  if (!/^\d{4}$/.test(pin)) {
    errorsValidation.push({ pin: 'pin is required' });
  }
  if (!/^\d{10}$/.test(accountNo)) {
    errorsValidation.push({ accountNo: 'Account number is required or is not of the right format' });
  }

  if (!/^\d{3}$/.test(bankCode)) {
    errorsValidation.push({ bankCode: 'Bank code is required or is not of the right format' });
  }

  if (typeof description != 'string' || description.length === 0) {
    errorsValidation.push({ description: 'Description is required or is not of the right format' });
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(400, 'Validation', 'Excel payload error', null, null, errorsValidation);
    return next(customError);
  }
  return next();
};
