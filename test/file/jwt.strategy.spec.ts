import { Test } from '@nestjs/testing';
import { JwtAuthGuard } from '../../src/auth/jwt.strategy';
import { AuthService } from '../../src/auth/auth.service';
import { ExecutionContext } from '@nestjs/common';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  const mockAuth = {
    generateToken: jest.fn(),
    verifyToken: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: AuthService,
          useValue: mockAuth,
        },
      ],
    }).compile();

    guard = module.get(JwtAuthGuard);

    jest.clearAllMocks();
  });

  it('should authenticate using cookie token', () => {
    mockAuth.verifyToken.mockReturnValue({
      userId: '1',
    });

    const req = {
      cookies: {
        token: 'abc',
      },
    };

    const res = {
      cookie: jest.fn(),
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => res,
      }),
    } as ExecutionContext;

    expect(guard.canActivate(context)).toBe(true);

    expect(mockAuth.verifyToken).toHaveBeenCalledWith('abc');
  });

  it('should authenticate using bearer token', () => {
    mockAuth.verifyToken.mockReturnValue({
      userId: '1',
    });

    const req = {
      cookies: {},
      headers: {
        authorization: 'Bearer token123',
      },
    };

    const res = {
      cookie: jest.fn(),
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => res,
      }),
    } as ExecutionContext;

    expect(guard.canActivate(context)).toBe(true);

    expect(mockAuth.verifyToken).toHaveBeenCalledWith('token123');
  });

  it('should authenticate using bearer token', () => {
    mockAuth.verifyToken.mockReturnValue({
      userId: '1',
    });

    const req = {
      cookies: {},
      headers: {
        authorization: 'Bearer token123',
      },
    };

    const res = {
      cookie: jest.fn(),
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => res,
      }),
    } as ExecutionContext;

    expect(guard.canActivate(context)).toBe(true);

    expect(mockAuth.verifyToken).toHaveBeenCalledWith('token123');
  });

  it('should return false when token is invalid', () => {
    mockAuth.verifyToken.mockReturnValue(null);

    const req = {
      cookies: {
        token: 'bad-token',
      },
    };

    const res = {
      cookie: jest.fn(),
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => res,
      }),
    } as ExecutionContext;

    expect(guard.canActivate(context)).toBe(false);
  });
});
