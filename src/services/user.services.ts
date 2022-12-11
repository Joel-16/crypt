import axios from 'axios';
import { compareSync, hashSync } from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import { NextFunction } from 'express';
import path from 'path';
import { Service } from 'typedi';

import { User, Wallet} from '../entities';
import WalletService from '../services/wallet.services';
import { createUserJwtToken } from '../utils/createJwtToken';
import { CustomError } from '../utils/response/custom-error/CustomError';

@Service()
class UserService {
  constructor(
    private readonly walletService: WalletService,
    private readonly user = User,
    private readonly wallet = Wallet
  ) {}

  async register(payload, next: NextFunction) {
    try {
      const usertest = await this.user.findOneBy({ email: payload.email });
      if (usertest) {
        return { message: 'Email already associated with an account' };
      }
      const user = await this.user.save({
        phoneNumber: payload.phoneNumber,
        firstname: payload.firstname,
        lastname: payload.lastname,
        email: payload.email,
      });
    
      delete user.password;
    } catch (err) {
      return next(new CustomError(400, 'Raw', `User '${payload.email}' can't be created`, null, err));
    }
  }

  async delete(email){
   let a =  await this.user.delete({email})
    return a 
  }

  async all(){
    console.log(path.resolve(process.cwd(), 'dsfdf.xlsx'))
    return await this.user.find({select : ["email"]})
  }

  async confirmAccount(userId, password, location, next: NextFunction) {
    try {
      const user = await this.user.findOneBy({ id: userId });
      if (!user) {
        return next(new CustomError(400, 'General', 'User Account not found'));
      }
      if (user.verified){
        return {message : "Account already verified"}
      }
      user.password = hashSync(password, 10);
      user.verified = true;
      await user.save();
      const response = await this.walletService.create({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phoneNumber,
        pin: password,
        location: location
      }, next) as any
      let wallet = await this.wallet.save({
        accountNo : String(response.result.data.account_no),
        balance : String(response.result.data.balance),
        bank_code : '000'
      })
      user.wallet = wallet
      await user.save()
      delete user.password;
      return {
        token: createUserJwtToken({ id: user.id, contact: user.email }),
      };
    } catch (err) {
      return next(new CustomError(400, 'Raw', err));
    }
  }
  async login(payload, next: NextFunction) {
    try {
      let user = await this.user.findOne({
        where: { email: payload.email },
        select: ['password', 'id', 'firstname', 'lastname', 'phoneNumber'],
      });
      let a =
        user && compareSync(payload.password, user.password)
          ? { token: createUserJwtToken({ id: user.id }), data: user }
          : { code: 400, message: 'Invalid credentials' };
      // let qpaytoken = await this.walletService.login({pin : payload.password, phone : user.phoneNumber})
      // if (qpaytoken.data.jwt){
      //   user.qpayToken = qpaytoken.data.jwt
      //   await user.save()
      // } else {
      //   console.log(`Unsuccessfull Qpay Login from ${user.email}`)
      // }
      if(a.data){
        delete a.data.password
        delete a.data.wallet
      }
      // const { password, qpayToken, orders, ...result } = user.data;
      return a;
    } catch (err) {
      return next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  }

  async forgotPassword(email, next: NextFunction) {
    try {
      const user = await this.user.findOneBy({ email });
      if (!user) {
        return next(new CustomError(400, 'General', "Account doesn't exists"));
      }
      const token = String(Math.floor(Math.pow(10, 5) + Math.random() * (Math.pow(10, 6) - Math.pow(10, 5) - 1)));
      await user.save();
      setTimeout(await decativate, 900000);
      async function decativate() {
        await user.save();
      }
      return { message: 'Please input the code sent to your mail' };
    } catch (error) {
      return next(new CustomError(400, 'Raw', 'Error', null, error));
    }
  }

  async getProfile({ id }, next: NextFunction) {
    try {
      return await this.user.findOneBy({ id });
    } catch (err) {
      return next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  }
 
}
export default UserService;
