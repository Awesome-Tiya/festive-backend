import { Test } from '@nestjs/testing';
import { ArticleController } from '../../../src/article/article.controller';
import { ArticleService } from '../../../src/article/article.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('ArticleController', () => {
  let controller: ArticleController;

  const mockArticleService = {
    createArticle: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ArticleController],
      providers: [
        {
          provide: ArticleService,
          useValue: mockArticleService,
        },
      ],
    }).compile();

    controller = module.get<ArticleController>(ArticleController);

    jest.clearAllMocks();
  });

  it('should call createArticle', async () => {
    await controller.createArticle();

    expect(mockArticleService.createArticle).toHaveBeenCalled();
  });

  it('should call delete', async () => {
    await controller.deleteArticle('1');

    expect(mockArticleService.delete).toHaveBeenCalledWith('1');
  });
});
