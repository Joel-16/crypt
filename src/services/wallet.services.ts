import axios from 'axios';
import { NextFunction } from 'express';
import { Service } from 'typedi';

import { User } from '../entities';
import { CustomError } from '../utils/response/custom-error/CustomError';

@Service()
class WalletService {
  constructor(private readonly user = User) {}

  async login(payload) {
    let data = axios.post(
        "https://app.scanpay.ng/api/v2/login",payload
       ).then((response)=>{
          return response
        }).catch((error)=>{
          return null
        })
   return data 
  }

  async create(payload, next: NextFunction) {
    try {
      const { data } = await axios.post(
        'https://app.scanpay.ng/api/v2/register',
        {
          firstname: payload.firstname,
          lastname: payload.lastname,
          email: payload.email,
          phone: payload.phone,
          pin: payload.pin,
          location: payload.location,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );
      await this.verifyAccount(data);
      await this.setPin(data, payload.pin);
      const result = await this.walletBalance(data.data.jwt, next);
      return { result: result, jwt: data.data.jwt };
    } catch (err) {
      return next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  }
  async transfer(payload, jwt, next: NextFunction) {
    try {
      const { data } = await axios.post(
        'https://app.scanpay.ng/api/v2/transaction/account/withdraw-funds',
        {
          amount: payload.amount,
          pin: payload.pin,
          account_number: payload.account_number,
          bank_code: payload.code,
          description: payload.description,
          from_puff_and_pazz: true,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );
      return data;
    } catch (error) {
      return next(new CustomError(400, 'Raw', 'Error', null, error));
    }
  }

  async addCard(email: string, qpayToken: string, next: NextFunction) {
    try {
      const result = await this.generateReference(qpayToken);
      const { data } = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
          amount: 10000,
          email: email,
          reference: result,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.LIFE_KEY}`,
          },
        },
      );
      return { payment_url: data?.data?.authorization_url };
    } catch (error) {
      return next(new CustomError(400, 'Raw', error));
    }
  }
  async fundWallet(payload, qpayToken, next: NextFunction) {
    try {
      const { data } = await axios.post(
        'https://app.scanpay.ng/api/v2/transaction/fund-wallet/card',
        {
          amount: payload.amount,
          fund_wallet_with_card: 'true',
          signature: payload.signature,
          authorization_code: payload.auth_code,
          from_puff_and_pazz: true,
        },
        {
          headers: {
            Authorization: `Bearer ${qpayToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );
      return data;
    } catch (error) {
      return next(new CustomError(400, 'Raw', 'Error', null, error));
    }
  }
  async walletBalance(jwt, next: NextFunction) {
    try {
      const { data } = await axios.get('https://app.scanpay.ng/api/v2/user/wallet-balance', {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      return data
    } catch (error) {
      return next(new CustomError(400, 'Raw', 'Error', null, error));
    }
  }

  async getCards(jwt, next: NextFunction) {
    try {
      const { data } = await axios.get('https://app.scanpay.ng/api/v2/user/card-details', {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      return data?.data;
    } catch (error) {
      return next(new CustomError(400, 'Raw', 'Error', null, error));
    }
  }

  private async verifyAccount(payload) {
    const { data } = await axios.post(
      'https://app.scanpay.ng/api/v2/verify-user-without-code',
      {
        secret: `${process.env.QPAYSECRET}`,
        from_puff_and_pazz: true,
      },
      {
        headers: {
          Authorization: `Bearer ${payload.data.jwt}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    );
    return;
  }

  private async setPin(payload, pin) {
    const { data } = await axios.post(
      'https://app.scanpay.ng/api/v2/set-pin',
      {
        new_pin: pin,
      },
      {
        headers: {
          Authorization: `Bearer ${payload.data.jwt}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    );
    return;
  }

  private async generateReference(qpayToken) {
    const { data } = await axios.post(
      'https://app.scanpay.ng/api/v2/transaction/fund-wallet/get-card-ref',
      {
        amount: 100,
        from_puff_and_pazz: true,
      },
      {
        headers: {
          Authorization: `Bearer ${qpayToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    );
    return data?.data;
    // let data = axios.post(
    //   "https://app.scanpay.ng/api/v2/transaction/fund-wallet/get-card-ref",
    //   {
    //     amount: 100,
    //     from_puff_and_pazz: true
    //   }).then((response)=>{
    //     console.log(response)
    //     return response
    //   }).catch((error)=>{
    //     console.error(error.response.data)
    //     return error
    //   })
  }
}
export default WalletService;
