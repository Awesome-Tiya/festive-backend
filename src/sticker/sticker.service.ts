import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStickerDto } from './dto/create-sticker.dto';
import { PrismaService } from '../prisma/prisma.service';
import { StickerGateway } from './sticker.gateway';

@Injectable()
export class StickerService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly stickerGateway: StickerGateway,
  ) {}

  async putSticker(articleId: string, dto: CreateStickerDto, userId: string) {
    const article = await this.prismaService.article.findUnique({
      where: { id: articleId },
    });
    if (!article) throw new NotFoundException('Article not found');

    return await this.prismaService.$transaction(async (prisma) => {
      const existingCount = await prisma.sticker.count({
        where: { articleId: articleId },
      });
      const existingCountPerUser = await prisma.sticker.count({
        where: { articleId: articleId, username: userId },
      });
      if (existingCount >= 5)
        throw new BadRequestException('For this article sticker limit reached');
      if (existingCountPerUser >= 1)
        throw new BadRequestException('For you sticker limit reached');

      const near = await prisma.sticker.findFirst({
        where: {
          articleId: articleId,
          x: { gte: dto.x - 0.05, lte: dto.x + 0.05 },
          y: { gte: dto.y - 0.05, lte: dto.y + 0.05 },
        },
      });
      if (near) throw new BadRequestException('Too close to another sticker');

      const sticker = await prisma.sticker.create({
        data: {
          username: userId,
          name: dto.name,
          articleId: articleId,
          x: dto.x,
          y: dto.y,
        },
      });
      this.stickerGateway.server.to(articleId).emit('sticker:put', sticker);

      return sticker;
    });
  }

  async getStickers(articleId: string) {
    return this.prismaService.sticker.findMany({ where: { articleId } });
  }

  // NOTE: currently unrestricted; intended for admin/moderation only
  async removeSticker(articleId: string, stickerId: string) {
    const article = await this.prismaService.article.findUnique({
      where: { id: articleId },
    });
    if (!article) throw new NotFoundException('Article not found');

    const sticker = await this.prismaService.sticker.findUnique({
      where: { id: stickerId },
    });
    if (!sticker) throw new NotFoundException('Sticker not found');

    await this.prismaService.sticker.delete({ where: { id: stickerId } });
    this.stickerGateway.server.to(articleId).emit('sticker:no', stickerId);
  }
}
