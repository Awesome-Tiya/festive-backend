import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from './auth-request.interface';

@Injectable()
export class AuthService {
  generateToken(): string {
    const key = process.env.JWT_SECRET as string;
    return jwt.sign(
      {
        sub: 'anon',
        userId: 'anon_' + randomUUID(),
        createdAt: Date.now(),
      },
      key,
      { expiresIn: '360d' },
    );
  }

  verifyToken(token: string): JwtPayload | null {
    const key = process.env.JWT_SECRET as string;
    try {
      const payload = jwt.verify(token, key);

      if (typeof payload === 'string') {
        return null;
      }

      return payload as JwtPayload;
    } catch {
      return null;
    }
  }
}
