import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  async toggleLike(userId: string, commentId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) throw new NotFoundException('Comment not found');
    const existingLike = await this.prisma.like.findUnique({
      where: { commentId_username: { commentId: commentId, username: userId } },
    });
    if (existingLike) {
      await this.prisma.like.delete({ where: { id: existingLike.id } });
      return { liked: false };
    }
    try {
      const newLike = await this.prisma.like.create({
        data: {
          commentId: commentId,
          username: userId,
        },
      });

      return { liked: true, like: newLike };
    } catch (error) {
      console.error('Error toggling like:', error);
      return { liked: false };
    }
  }
}
