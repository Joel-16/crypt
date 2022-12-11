import jwt from 'jsonwebtoken';

export type JwtPayload = {
  id: number;
  contact?: string;
  role?: string;
  warehouse?: string;
};

export const createUserJwtToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, process.env.USER_JWT_SECRET!, {
    expiresIn: 172800,
  });
};

export const createStaffJwtToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, process.env.STAFF_JWT_SECRET!, {
    expiresIn: 172800,
  });
};
