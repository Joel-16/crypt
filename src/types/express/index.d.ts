import { JwtPayload } from '../../utils/createJwtToken';

declare global {
  namespace Express {
    export interface Request {
      jwtPayload: JwtPayload;
    }
    export interface Response {
      customSuccess(httpStatusCode: number, data?: any): Response;
    }
  }
}
