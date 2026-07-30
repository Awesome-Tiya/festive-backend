import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { LikeService } from './like.service';
import { User } from 'src/auth/user.decorator';
import type { JwtPayload } from '../auth/auth-request.interface';
import { JwtAuthGuard } from 'src/auth/jwt.strategy';

@Controller('festive/comment')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/:commentId/like')
  async toggleLike(
    @User() user: JwtPayload,
    @Param('commentId') commentId: string,
  ) {
    return this.likeService.toggleLike(user.userId, commentId);
  }
}
