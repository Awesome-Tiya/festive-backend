import { describe, jest, it, expect, beforeEach } from '@jest/globals';
import { CommentService } from '../../src/comment/comment.service';
import { CommentFlagReason, Prisma } from '@prisma/client';
import { PrismaService } from '../../src/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

describe('CommentService', () => {
  let commentService: CommentService;

  const mockPrismaService = {
    article: {
      findUnique: jest.fn(),
    },
    comment: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    commentFlag: {
      create: jest.fn(),
      count: jest.fn(),
    },
  } as unknown as jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    commentService = module.get<CommentService>(CommentService);

    jest.clearAllMocks();
  });

  const articleId = 'article1';
  const comment = {
    id: 'comment1',
    articleId: articleId,
    isFlag: false,
    comment: 'a comment',
    username: 'user1',
    time: new Date(),
  };
  const comments = [
    {
      _count: {
        likes: 5,
      },
      id: 'comment1',
      isFlag: false,
      comment: 'a comment',
      username: 'user1',
      time: new Date(),
      articleId: 'article1',
    },
    {
      _count: {
        likes: 4,
      },
      id: 'comment2',
      isFlag: false,
      comment: 'a comment',
      username: 'user2',
      time: new Date(),
      articleId: 'article1',
    },
  ];

  describe('createComment', () => {
    it('should create a comment successfully', async () => {
      mockPrismaService.article.findUnique.mockResolvedValueOnce({
        id: articleId,
        username: 'user1',
        time: null,
        text: '',
        title: '',
        album: null,
      });

      mockPrismaService.comment.create.mockResolvedValueOnce(comment);

      const commented = await commentService.createComment(
        articleId,
        { comment: 'a comment' },
        'user1',
      );

      expect(commented.comment).toEqual(comment.comment);
      expect(commented.articleId).toEqual(comment.articleId);
      expect(commented.username).toEqual(comment.username);
      expect(commented.isFlag).toEqual(comment.isFlag);
    });

    it('should throw NotFoundException if article does not exist', async () => {
      mockPrismaService.article.findUnique.mockResolvedValueOnce(null);

      mockPrismaService.comment.create.mockResolvedValueOnce(comment);

      await expect(
        commentService.createComment('', { comment: 'a comment' }, 'user1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getTopComment', () => {
    it('should return the top comment with most likes', async () => {
      mockPrismaService.comment.findMany.mockResolvedValueOnce(comments);

      const result = await commentService.getTopComment('article1');

      expect(result).toEqual(comments[0]);
    });

    it('should throw NotFoundException if no comments or comments with likes found', async () => {
      mockPrismaService.comment.findMany.mockResolvedValueOnce([]);

      await expect(commentService.getTopComment('article1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getComments', () => {
    it('should return a list of comments for an article', async () => {
      mockPrismaService.comment.findMany.mockResolvedValueOnce(comments);

      const result = await commentService.getComments('article1', 5);

      expect(result).toEqual(comments);
    });

    it('should return an empty array if no comments found', async () => {
      mockPrismaService.comment.findMany.mockResolvedValueOnce([]);

      const comments = await commentService.getComments('article1', 5);
      expect(comments).toEqual([]);
    });
  });

  describe('flagComment', () => {
    it('should flag a comment successfully', async () => {
      const flagComment = {
        id: 'flag1',
        commentId: comment.id,
        username: 'user2',
        reason: CommentFlagReason.SPAM,
        createdAt: new Date(),
      };

      mockPrismaService.comment.findUnique.mockResolvedValueOnce(comment);
      mockPrismaService.commentFlag.create.mockResolvedValueOnce(flagComment);
      mockPrismaService.commentFlag.count.mockResolvedValueOnce(1);

      const flaggedComment = await commentService.flagComment(
        'comment1',
        CommentFlagReason.SPAM,
        'user2',
      );

      expect(flaggedComment.flaggedComment?.commentId).toEqual(
        flagComment.commentId,
      );
      expect(flaggedComment.flaggedComment?.id).toEqual(flagComment.id);
      expect(flaggedComment.flaggedComment?.username).toEqual(
        flagComment.username,
      );
      expect(flaggedComment.flaggedComment?.reason).toEqual(flagComment.reason);
    });

    it('should return message if comment is already hidden due to flags', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValueOnce({
        ...comment,
        isFlag: true,
      });

      const flaggedComment = await commentService.flagComment(
        'comment1',
        CommentFlagReason.SPAM,
        'user2',
      );

      expect(flaggedComment.message).toEqual(
        'Comment is already hidden due to flags',
      );
    });

    it('should return message if comment is already flagged', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValueOnce(comment);
      mockPrismaService.commentFlag.create.mockRejectedValueOnce(
        new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
          code: 'P2002',
          clientVersion: '6.0.0',
        }),
      );
      mockPrismaService.commentFlag.count.mockResolvedValueOnce(1);

      const flaggedComment = await commentService.flagComment(
        'comment1',
        CommentFlagReason.SPAM,
        'user2',
      );

      expect(flaggedComment.message).toEqual(
        'You have already flagged this comment',
      );
    });
  });
});
