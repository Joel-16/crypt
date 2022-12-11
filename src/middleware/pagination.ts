import { Response, NextFunction, Request } from 'express';

import { CustomError } from '../utils/response/custom-error/CustomError';
import { ErrorValidation } from '../utils/response/custom-error/types';

export const pagination = (req, res: Response, next: NextFunction) => {
  const { name, price, limit, page } = req.query;
  const errorsValidation: ErrorValidation[] = [];
  const parsed: {
    name?: string;
    price?: number;
    limit: number;
    page: number;
  } = {
    name: '',
    price: 0,
    limit: 5,
    page: 0,
  };
  if (limit) {
    if (isNaN(Number(limit))) {
      errorsValidation.push({ limit: 'limit is not a valid number' });
    } else {
      parsed.limit = Number(limit);
    }
  }
  if (name) {
    parsed.name = String(name);
  }
  if (price) {
    if (isNaN(Number(price))) {
      errorsValidation.push({ price: 'limit is not a valid number' });
    } else {
      parsed.price = Number(price);
    }
  }
  if (page) {
    if (isNaN(Number(page)) || Number(page) === 0) {
      errorsValidation.push({ page: 'page is not a valid number' });
    } else {
      parsed.page = Number(page) - 1;
    }
  }
  if (errorsValidation.length !== 0) {
    const customError = new CustomError(400, 'Validation', 'Pagination error', null, null, errorsValidation);
    return next(customError);
  }
  req.query = parsed;
  return next();
};
