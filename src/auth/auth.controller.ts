import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Get('/token')
  getToken() {
    const token = this.auth.generateToken();
    return { token };
  }
}
