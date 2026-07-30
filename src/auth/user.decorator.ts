import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequest, JwtPayload } from './auth-request.interface';

export const User = createParamDecorator(
  (data, ctx: ExecutionContext): JwtPayload | undefined => {
    const req = ctx.switchToHttp().getRequest<AuthRequest>();
    return req.user;
  },
);
