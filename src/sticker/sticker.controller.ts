import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateStickerDto } from './dto/create-sticker.dto';
import type { JwtPayload } from '../auth/auth-request.interface';
import { JwtAuthGuard } from 'src/auth/jwt.strategy';
import { User } from 'src/auth/user.decorator';
import { StickerService } from './sticker.service';

@Controller('festive')
export class StickerController {
  constructor(private readonly stickerService: StickerService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/:articleId/sticker')
  async putSticker(
    @Param('articleId') articleId: string,
    @Body() dto: CreateStickerDto,
    @User() user: JwtPayload,
  ) {
    return await this.stickerService.putSticker(articleId, dto, user.userId);
  }

  @Get('/:articleId/sticker')
  async getStickers(@Param('articleId') articleId: string) {
    return await this.stickerService.getStickers(articleId);
  }

  // NOTE: currently unrestricted; intended for admin/moderation only
  @Delete('/:articleId/sticker/:stickerId')
  async removeSticker(
    @Param('articleId') articleId: string,
    @Param('stickerId') stickerId: string,
  ) {
    return await this.stickerService.removeSticker(articleId, stickerId);
  }
}
