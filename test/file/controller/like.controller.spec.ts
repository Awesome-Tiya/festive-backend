import { Test } from '@nestjs/testing';
import { LikeController } from '../../../src/like/like.controller';
import { LikeService } from '../../../src/like/like.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { JwtAuthGuard } from '../../../src/auth/jwt.strategy';

describe('LikeController', () => {
  let controller: LikeController;

  const mockLikeService = {
    toggleLike: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [LikeController],
      providers: [
        {
          provide: LikeService,
          useValue: mockLikeService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    controller = module.get(LikeController);
  });

  it('should call toggleLike', async () => {
    await controller.toggleLike({ userId: '1' }, 'comment1');

    expect(mockLikeService.toggleLike).toHaveBeenCalledWith('1', 'comment1');
  });
});
