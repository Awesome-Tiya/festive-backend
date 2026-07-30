import { Test } from '@nestjs/testing';
import { UpvoteController } from '../../../src/upvote/upvote.controller';
import { UpvoteService } from '../../../src/upvote/upvote.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { JwtAuthGuard } from '../../../src/auth/jwt.strategy';

describe('UpvoteController', () => {
  let controller: UpvoteController;

  const mockUpvoteService = {
    toggleUpvote: jest.fn(),
    numberOfUpvotes: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UpvoteController],
      providers: [
        {
          provide: UpvoteService,
          useValue: mockUpvoteService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    controller = module.get(UpvoteController);
  });

  it('should call toggleUpvote', async () => {
    await controller.toggleUpvote('article1', { userId: '1' });

    expect(mockUpvoteService.toggleUpvote).toHaveBeenCalledWith(
      'article1',
      '1',
    );
  });

  it('should call numberOfUpvotes', async () => {
    await controller.numberOfUpvotes('article1');

    expect(mockUpvoteService.numberOfUpvotes).toHaveBeenCalledWith('article1');
  });
});
