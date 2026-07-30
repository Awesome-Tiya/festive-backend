import { describe, jest, it, expect, beforeEach } from '@jest/globals';
import { LikeService } from '../../src/like/like.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

describe('LikeService', () => {
  let likeService: LikeService;

  const mockPrismaService = {
    comment: {
      findUnique: jest.fn(),
    },
    like: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  } as unknown as jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikeService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    likeService = module.get<LikeService>(LikeService);

    jest.clearAllMocks();
  });

  describe('toggleLike', () => {
    const comment = {
      comment: 'a comment',
      id: 'comment1',
      username: 'user1',
      time: new Date(),
      articleId: 'article1',
      isFlag: false,
    };

    it('should toggle like', async () => {
      const newLike = {
        id: 'like1',
        username: 'user1',
        commentId: 'comment1',
      };

      mockPrismaService.comment.findUnique.mockResolvedValue(comment);
      mockPrismaService.like.findUnique.mockResolvedValue(null);
      mockPrismaService.like.create.mockResolvedValue(newLike);

      const liked = await likeService.toggleLike('user1', 'comment1');

      expect(liked).toEqual({ liked: true, like: newLike });
    });

    it('should toggle unlike', async () => {
      const existingLike = {
        id: 'like1',
        username: 'user1',
        commentId: 'comment1',
      };

      mockPrismaService.comment.findUnique.mockResolvedValue(comment);
      mockPrismaService.like.findUnique.mockResolvedValue(existingLike);
      mockPrismaService.like.delete.mockResolvedValue(existingLike);

      const liked = await likeService.toggleLike('user1', 'comment1');

      expect(liked).toEqual({ liked: false });
    });

    it('should throw NotFoundException if no comment found by prisma', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(null);

      await expect(likeService.toggleLike('user1', 'comment1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
