import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRequest } from './auth-request.interface';
import { Response } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private auth: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<AuthRequest>();
    const res = context.switchToHttp().getResponse<Response>();

    let token = req.cookies?.token;

    if (!token) {
      const authHeader = req.headers['authorization'];
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      const newToken = this.auth.generateToken();
      const payload = this.auth.verifyToken(newToken);
      if (!payload) return false;

      res.cookie('token', newToken, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 360, // 360 days
      });

      req.user = payload;
      return true;
    }

    const payload = this.auth.verifyToken(token);
    if (!payload) return false;

    req.user = payload;
    return true;
  }
}
