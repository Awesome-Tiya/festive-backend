import { Test } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { beforeEach, describe, expect, it } from '@jest/globals';

describe('AuthService', () => {
  let service: AuthService;

  process.env.JWT_SECRET = 'sample';

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get(AuthService);
  });

  it('should generate a jwt token', () => {
    const token = service.generateToken();

    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(20);
  });

  it('should verify a generated token', () => {
    const token = service.generateToken();

    const payload = service.verifyToken(token);

    expect(payload).toHaveProperty('userId');
    expect(payload).toHaveProperty('sub', 'anon');
  });

  it('should return null for invalid token', () => {
    expect(service.verifyToken('invalid-token')).toBeNull();
  });
});
