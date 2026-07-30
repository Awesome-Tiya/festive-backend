import { describe, jest, it, expect, beforeEach } from '@jest/globals';
import { UpvoteService } from '../../src/upvote/upvote.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

describe('UpvoteService', () => {
  let upvoteService: UpvoteService;

  const mockPrismaService = {
    article: {
      findUnique: jest.fn(),
    },
    upVote: {
      findUnique: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
    },
  } as unknown as jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpvoteService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    upvoteService = module.get<UpvoteService>(UpvoteService);

    jest.clearAllMocks();
  });

  const article = {
    id: 'article1',
    text: '',
    title: '',
    username: null,
    album: null,
    time: null,
  };
  const existingUpvote = {
    id: 'upvote1',
    username: 'user1',
    articleId: 'article1',
  };

  describe('toggleUpvote', () => {
    it('should upvote', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue(article);
      mockPrismaService.upVote.findUnique.mockResolvedValue(null);
      mockPrismaService.upVote.create.mockResolvedValue(existingUpvote);

      const upvote = await upvoteService.toggleUpvote('article1', 'user1');

      expect(upvote.upvote).toEqual(existingUpvote);
      expect(upvote.upvoted).toBe(true);
    });

    it('should toggle to remove upvote', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue(article);
      mockPrismaService.upVote.findUnique.mockResolvedValue(existingUpvote);
      mockPrismaService.upVote.delete.mockResolvedValue(existingUpvote);

      const upvote = await upvoteService.toggleUpvote('article1', 'user1');

      expect(upvote.upvoted).toBe(false);
    });

    it('should throw NotFoundException if article does not exist', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue(null);

      await expect(
        upvoteService.toggleUpvote('article1', 'user1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('numberOfUpvotes', () => {
    it('should return the number of upvotes', async () => {
      mockPrismaService.upVote.count.mockResolvedValue(5);

      const count = await upvoteService.numberOfUpvotes('article1');

      expect(count).toEqual(5);
    });
  });
});
