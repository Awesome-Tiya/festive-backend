import { describe, jest, it, expect, beforeEach } from '@jest/globals';
import { ArticleService } from '../../src/article/article.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('ArticleService', () => {
  let articleService: ArticleService;

  const mockPrismaService = {
    dailyFestival: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    article: {
      delete: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
    },
  } as unknown as jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    articleService = module.get<ArticleService>(ArticleService);

    jest.clearAllMocks();
  });

  const today = new Date().toISOString().split('T')[0];

  const existing = {
    id: 'existing1',
    date: new Date(today),
    fest1Id: 'fest1',
    fest1Name: 'Festival 1',
    fest1Desc: 'Description for Festival 1',
    fest2Id: 'fest2',
    fest2Name: 'Festival 2',
    fest2Desc: 'Description for Festival 2',
    createdAt: new Date(today),
  };

  const fest = {
    id: 'existing2',
    date: new Date(today),
    fest1Id: 'fest3',
    fest1Name: 'Festival 3',
    fest1Desc: 'Description for Festival 3',
    fest2Id: 'fest4',
    fest2Name: 'Festival 4',
    fest2Desc: 'Description for Festival 4',
    createdAt: new Date(today),
  };

  const article = {
    id: 'article1',
    text: 'Sample article text',
    title: 'Sample Article',
    username: null,
    album: null,
    time: new Date(),
  };

  const fests1 = {
    festivalsandcultures: [
      { name: 'Festival 1', description: 'Description for Festival 1' },
      { name: 'Festival 2', description: 'Description for Festival 2' },
    ],
  };

  const fests2 = {
    festivalsandcultures: [
      { name: 'Festival 1', description: 'Description for Festival 1' },
      { name: 'Festival 2', description: 'Description for Festival 2' },
      { name: 'Festival 3', description: 'Description for Festival 3' },
      { name: 'Festival 4', description: 'Description for Festival 4' },
    ],
  };

  const existingArticles = [
    {
      id: '1',
      title: 'Festival 1',
      text: '',
      username: null,
      album: null,
      time: null,
    },
    {
      id: '2',
      title: 'Festival 2',
      text: '',
      username: null,
      album: null,
      time: null,
    },
  ];

  const fests3 = {
    festivalsandcultures: [
      { name: 'Festival 1', description: 'Description for Festival 1' },
      { name: 'Festival 2', description: 'Description for Festival 2' },
      { name: 'Festival 3', description: 'Description for Festival 3' },
    ],
  };

  describe('createArticle', () => {
    it('should return newly created daily festival with non missing fests if it does not exist', async () => {
      mockPrismaService.dailyFestival.findUnique.mockResolvedValue(null);
      mockPrismaService.article.findMany.mockResolvedValue(existingArticles);
      mockPrismaService.article.create.mockResolvedValueOnce(
        existingArticles[0],
      );
      mockPrismaService.article.create.mockResolvedValueOnce(
        existingArticles[1],
      );
      mockPrismaService.dailyFestival.create.mockResolvedValueOnce(existing);

      const article1 = await articleService.createArticle(fests1);

      expect(article1).toBeDefined();
      expect(article1.fest1Desc).toEqual('Description for Festival 1');
      expect(article1.fest2Desc).toEqual('Description for Festival 2');
      expect(article1.createdAt).toBeDefined();
      expect(article1.fest1Id).toBeDefined();
      expect(article1.fest2Id).toBeDefined();
      expect(article1.fest1Name).toEqual('Festival 1');
      expect(article1.fest2Name).toEqual('Festival 2');
      expect(article1.date).toEqual(new Date(today));
      expect(mockPrismaService.dailyFestival.findUnique).toHaveBeenCalledWith({
        where: { date: new Date(today) },
      });
    });

    it('should return newly created daily festival with missing fests if it does not exist', async () => {
      mockPrismaService.dailyFestival.findUnique.mockResolvedValue(null);
      mockPrismaService.article.findMany.mockResolvedValue(existingArticles);
      mockPrismaService.article.create.mockResolvedValueOnce(
        existingArticles[0],
      );
      mockPrismaService.article.create.mockResolvedValueOnce(
        existingArticles[1],
      );
      mockPrismaService.dailyFestival.create.mockResolvedValueOnce(fest);

      const article1 = await articleService.createArticle(fests2);

      expect(article1).toBeDefined();
      expect(article1.fest1Desc).toEqual('Description for Festival 3');
      expect(article1.fest2Desc).toEqual('Description for Festival 4');
      expect(article1.createdAt).toBeDefined();
      expect(article1.fest1Id).toBeDefined();
      expect(article1.fest2Id).toBeDefined();
      expect(article1.fest1Name).toEqual('Festival 3');
      expect(article1.fest2Name).toEqual('Festival 4');
      expect(article1.date).toEqual(new Date(today));
      expect(mockPrismaService.dailyFestival.findUnique).toHaveBeenCalledWith({
        where: { date: new Date(today) },
      });
    });

    it('should return newly created daily festival with existing fests if only one fest is missing', async () => {
      mockPrismaService.dailyFestival.findUnique.mockResolvedValue(null);
      mockPrismaService.article.findMany.mockResolvedValue(existingArticles);
      mockPrismaService.article.create.mockResolvedValueOnce(
        existingArticles[0],
      );
      mockPrismaService.article.create.mockResolvedValueOnce(
        existingArticles[1],
      );
      mockPrismaService.dailyFestival.create.mockResolvedValueOnce(existing);

      const article1 = await articleService.createArticle(fests3);

      expect(article1).toBeDefined();
      expect(article1.fest1Desc).toEqual('Description for Festival 1');
      expect(article1.fest2Desc).toEqual('Description for Festival 2');
      expect(article1.createdAt).toBeDefined();
      expect(article1.fest1Id).toBeDefined();
      expect(article1.fest2Id).toBeDefined();
      expect(article1.fest1Name).toEqual('Festival 1');
      expect(article1.fest2Name).toEqual('Festival 2');
      expect(article1.date).toEqual(new Date(today));
      expect(mockPrismaService.dailyFestival.findUnique).toHaveBeenCalledWith({
        where: { date: new Date(today) },
      });
    });

    it('should return existing daily festival if it exists', async () => {
      mockPrismaService.dailyFestival.findUnique.mockResolvedValue(existing);

      const article1 = await articleService.createArticle(fests1);

      expect(article1).toBeDefined();
      expect(article1.fest1Desc).toEqual(existing.fest1Desc);
      expect(article1.fest2Desc).toEqual(existing.fest2Desc);
      expect(article1.createdAt).toEqual(existing.createdAt);
      expect(article1.fest1Id).toEqual(existing.fest1Id);
      expect(article1.fest2Id).toEqual(existing.fest2Id);
      expect(article1.fest1Name).toEqual(existing.fest1Name);
      expect(article1.fest2Name).toEqual(existing.fest2Name);
      expect(article1.date).toEqual(today);
      expect(mockPrismaService.dailyFestival.findUnique).toHaveBeenCalledWith({
        where: { date: new Date(today) },
      });
    });
  });

  describe('delete', () => {
    it('should delete the article with the given id', async () => {
      mockPrismaService.article.delete.mockResolvedValue(article);

      const deletedArticle = await articleService.delete(article.id);
      expect(deletedArticle).toEqual(article);
    });
  });
});
