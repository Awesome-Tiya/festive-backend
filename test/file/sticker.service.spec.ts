import { describe, jest, it, expect, beforeEach } from '@jest/globals';
import { StickerService } from '../../src/sticker/sticker.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { StickerGateway } from '../../src/sticker/sticker.gateway';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

describe('StickerService', () => {
  let stickerService: StickerService;

  const mockEmit = jest.fn();

  const mockStickerGateway = {
    server: {
      to: jest.fn().mockReturnValue({
        emit: mockEmit,
      }),
    },
  } as unknown as jest.Mocked<StickerGateway>;

  const mockPrismaService = {
    article: {
      findUnique: jest.fn(),
    },
    sticker: {
      count: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
    },
    $transaction: jest.fn((callback: (prisma: unknown) => unknown) => {
      return callback(mockPrismaService);
    }),
  } as unknown as jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StickerService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: StickerGateway,
          useValue: mockStickerGateway,
        },
      ],
    }).compile();

    stickerService = module.get<StickerService>(StickerService);

    jest.clearAllMocks();
  });

  describe('putSticker', () => {
    const article = {
      id: 'article1',
      username: 'user1',
      text: 'Sample text',
      title: 'Sample title',
      album: null,
      time: new Date(),
    };

    it('should put a sticker successfully', async () => {
      mockPrismaService.article.findUnique.mockResolvedValueOnce(article);
      mockPrismaService.sticker.count.mockResolvedValueOnce(0); // existingCount
      mockPrismaService.sticker.count.mockResolvedValueOnce(0); // existingCountPerUser
      mockPrismaService.sticker.findFirst.mockResolvedValueOnce(null); // near

      const sticker = {
        name: 'chinese-lantern',
        id: 'lantern',
        username: 'user1',
        articleId: 'article1',
        x: 100,
        y: 200,
      };

      mockPrismaService.sticker.create.mockResolvedValueOnce(sticker);

      const putSticker = await stickerService.putSticker(
        article.id,
        { name: sticker.name, x: sticker.x, y: sticker.y },
        sticker.username,
      );

      expect(putSticker).toEqual(sticker);
      expect(mockStickerGateway.server.to).toHaveBeenCalledWith(article.id);
      expect(mockEmit).toHaveBeenCalledWith('sticker:put', sticker);

      expect(mockPrismaService.sticker.create).toHaveBeenCalledWith({
        data: {
          username: sticker.username,
          name: sticker.name,
          articleId: sticker.articleId,
          x: sticker.x,
          y: sticker.y,
        },
      });
      expect(mockPrismaService.$transaction).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.article.findUnique).toHaveBeenCalledWith({
        where: { id: article.id },
      });
      expect(mockPrismaService.sticker.count).toHaveBeenNthCalledWith(1, {
        where: { articleId: article.id },
      });
    });

    it('should throw NotFoundException if article not found', async () => {
      mockPrismaService.article.findUnique.mockResolvedValueOnce(null);

      await expect(
        stickerService.putSticker(
          'nonexistent-article',
          { name: 'chinese-lantern', x: 100, y: 200 },
          'user1',
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if article sticker limit reached', async () => {
      mockPrismaService.article.findUnique.mockResolvedValueOnce(article);
      mockPrismaService.sticker.count.mockResolvedValueOnce(5); // existingCount

      await expect(
        stickerService.putSticker(
          article.id,
          { name: 'chinese-lantern', x: 100, y: 200 },
          'user1',
        ),
      ).rejects.toThrow(BadRequestException);

      expect(mockPrismaService.article.findUnique).toHaveBeenCalledWith({
        where: { id: article.id },
      });
      expect(mockPrismaService.sticker.count).toHaveBeenCalledWith({
        where: { articleId: article.id },
      });
    });
    it('should throw BadRequestException if user sticker limit reached', async () => {
      mockPrismaService.article.findUnique.mockResolvedValueOnce(article);
      mockPrismaService.sticker.count.mockResolvedValueOnce(1); // existingCount
      mockPrismaService.sticker.count.mockResolvedValueOnce(1); // existingCountPerUser

      await expect(
        stickerService.putSticker(
          article.id,
          { name: 'chinese-lantern', x: 100, y: 200 },
          'user1',
        ),
      ).rejects.toThrow(BadRequestException);

      expect(mockPrismaService.article.findUnique).toHaveBeenCalledWith({
        where: { id: article.id },
      });
      expect(mockPrismaService.sticker.count).toHaveBeenCalledWith({
        where: { articleId: article.id, username: 'user1' },
      });
    });

    it('should throw BadRequestException if sticker is too close to another', async () => {
      const near = {
        id: 'sticker1',
        username: 'user1',
        name: 'chinese-lantern',
        x: 90,
        y: 190,
        articleId: 'article1',
      };

      mockPrismaService.article.findUnique.mockResolvedValueOnce(article);
      mockPrismaService.sticker.count.mockResolvedValueOnce(0); // existingCount
      mockPrismaService.sticker.count.mockResolvedValueOnce(0); // existingCountPerUser
      mockPrismaService.sticker.findFirst.mockResolvedValueOnce(near); // near

      await expect(
        stickerService.putSticker(
          article.id,
          { name: 'chinese-lantern', x: 100, y: 200 },
          'user1',
        ),
      ).rejects.toThrow(BadRequestException);

      expect(mockPrismaService.article.findUnique).toHaveBeenCalledWith({
        where: { id: article.id },
      });
      expect(mockPrismaService.sticker.count).toHaveBeenNthCalledWith(1, {
        where: { articleId: article.id },
      });
      expect(mockPrismaService.sticker.count).toHaveBeenNthCalledWith(2, {
        where: { articleId: article.id, username: 'user1' },
      });
      expect(mockPrismaService.sticker.findFirst).toHaveBeenCalledWith({
        where: {
          articleId: article.id,
          x: { gte: 99.95, lte: 100.05 },
          y: { gte: 199.95, lte: 200.05 },
        },
      });
    });
  });

  describe('getStickers', () => {
    it('should get stickers for an article', async () => {
      const stickers = [
        {
          id: 'sticker1',
          name: 'chinese-lantern',
          username: 'user1',
          articleId: 'article1',
          x: 100,
          y: 200,
        },
        {
          id: 'sticker2',
          name: 'chinese-lantern',
          username: 'user2',
          articleId: 'article1',
          x: 150,
          y: 250,
        },
      ];

      mockPrismaService.sticker.findMany.mockResolvedValueOnce(stickers);

      const stickerList = await stickerService.getStickers('article1');

      expect(stickerList).toEqual(stickers);
      expect(mockPrismaService.sticker.findMany).toHaveBeenCalledWith({
        where: { articleId: 'article1' },
      });
    });
  });
});
