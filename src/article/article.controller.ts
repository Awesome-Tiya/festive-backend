import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ArticleService } from './article.service';
import festivals from '../festivalsandcultures.json';

@Controller('festive')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('/')
  createArticle() {
    return this.articleService.createArticle(festivals);
  }

  @Delete('/delete/:articleId')
  deleteArticle(@Param('articleId') articleId: string) {
    return this.articleService.delete(articleId);
  }
}
