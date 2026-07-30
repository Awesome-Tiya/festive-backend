import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.strategy';
import type { JwtPayload } from '../auth/auth-request.interface';
import { User } from 'src/auth/user.decorator';
import { UpvoteService } from './upvote.service';

@Controller('festive')
export class UpvoteController {
  constructor(private readonly upvoteService: UpvoteService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/:articleId/upvote')
  toggleUpvote(
    @Param('articleId') articleId: string,
    @User() user: JwtPayload,
  ) {
    return this.upvoteService.toggleUpvote(articleId, user.userId);
  }

  @Get('/:articleId/upvotes')
  numberOfUpvotes(@Param('articleId') articleId: string) {
    return this.upvoteService.numberOfUpvotes(articleId);
  }
}
