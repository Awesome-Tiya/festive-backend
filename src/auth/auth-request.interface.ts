import { Request } from 'express';

export interface JwtPayload {
  sub: string;
  userId: string;
  createdAt: number;
}
export interface AuthRequest extends Request {
  user?: JwtPayload;
  cookies: {
    token?: string;
  };
}
