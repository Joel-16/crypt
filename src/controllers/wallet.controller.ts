import { Response, Request, NextFunction } from 'express';
import { Service } from 'typedi';

import WalletService from '../services/wallet.services';

@Service()
class CrmController {
  constructor(private readonly walletService: WalletService) {}

  getOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query;
      res.customSuccess(200, await this.walletService.create(query, next));
    } catch {
      next();
    }
  };
}

export default CrmController;
