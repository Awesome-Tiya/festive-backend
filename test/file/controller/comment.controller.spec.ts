import { Test } from '@nestjs/testing';
import { CommentController } from '../../../src/comment/comment.controller';
import { CommentService } from '../../../src/comment/comment.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { CommentFlagReason } from '@prisma/client';
import { JwtAuthGuard } from '../../../src/auth/jwt.strategy';
import { CreateCommentDto } from 'src/comment/dto/create-comment.dto';

describe('CommentController', () => {
  let controller: CommentController;

  const mockCommentService = {
    createComment: jest.fn(),
    deleteComment: jest.fn(),
    getTopComment: jest.fn(),
    getComments: jest.fn(),
    flagComment: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        {
          provide: CommentService,
          useValue: mockCommentService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    controller = module.get(CommentController);
  });

  it('should call createComment', async () => {
    await controller.createComment('1', {} as CreateCommentDto, {
      userId: '1',
      sub: '',
      createdAt: 0,
    });

    expect(mockCommentService.createComment).toHaveBeenCalledWith('1', {}, '1');
  });

  it('should call getTopComment', async () => {
    await controller.getTopComment('1');

    expect(mockCommentService.getTopComment).toHaveBeenCalledWith('1');
  });

  it('should call getComments', async () => {
    await controller.getComments('1', '20', 'LAST_COMMENT_ID');

    expect(mockCommentService.getComments).toHaveBeenCalledWith(
      '1',
      20,
      'LAST_COMMENT_ID',
    );
  });

  it('should call flagComment', async () => {
    await controller.flagComment(
      '1',
      { reason: CommentFlagReason.SPAM },
      {
        userId: '1',
        sub: '',
        createdAt: 0,
      },
    );

    expect(mockCommentService.flagComment).toHaveBeenCalledWith(
      '1',
      CommentFlagReason.SPAM,
      '1',
    );
  });

  it('should call deleteComment', async () => {
    await controller.deleteComment('1');

    expect(mockCommentService.deleteComment).toHaveBeenCalledWith('1');
  });
});
