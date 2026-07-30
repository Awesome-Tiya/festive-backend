import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentFlagReason } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt.strategy';
import type { JwtPayload } from '../auth/auth-request.interface';
import { User } from '../auth/user.decorator';

class FlagCommentDto {
  reason!: CommentFlagReason;
}

@Controller('festive')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/:articleId/comment')
  async createComment(
    @Param('articleId') articleId: string,
    @Body() dto: CreateCommentDto,
    @User() user: JwtPayload,
  ) {
    return this.commentService.createComment(articleId, dto, user.userId);
  }

  @Get('/:articleId/comment/top-comment')
  async getTopComment(@Param('articleId') articleId: string) {
    return this.commentService.getTopComment(articleId);
  }

  @Get('/:articleId/comments') // for front-end: GET /festive/{articleId}/comments?limit=20&cursor=LAST_COMMENT_ID
  async getComments(
    @Param('articleId') articleId: string,
    @Query('limit') limit: string,
    @Query('cursor') cursor: string,
  ) {
    return this.commentService.getComments(articleId, Number(limit), cursor);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/comment/:commentId/flag')
  async flagComment(
    @Param('commentId') commentId: string,
    @Body() reason: FlagCommentDto,
    @User() user: JwtPayload,
  ) {
    return this.commentService.flagComment(
      commentId,
      reason.reason,
      user.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/comment/:commentId/delete')
  async deleteComment(@Param('commentId') commentId: string) {
    return this.commentService.deleteComment(commentId);
  }
}
