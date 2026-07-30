import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UpvoteService {
  constructor(private prisma: PrismaService) {}

  async toggleUpvote(articleId: string, userId: string) {
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
    });
    if (!article) throw new NotFoundException('Article not found');

    const existingUpvote = await this.prisma.upVote.findUnique({
      where: { articleId_username: { articleId: articleId, username: userId } },
    });
    if (existingUpvote) {
      await this.prisma.upVote.delete({ where: { id: existingUpvote.id } });
      return { upvoted: false };
    }
    try {
      const newUpvote = await this.prisma.upVote.create({
        data: {
          articleId: articleId,
          username: userId,
        },
      });

      return { upvoted: true, upvote: newUpvote };
    } catch (error) {
      console.error('Error toggling upvote:', error);
      return { upvoted: false };
    }
  }

  async numberOfUpvotes(articleId: string) {
    const count = await this.prisma.upVote.count({
      where: { articleId: articleId },
    });
    return count;
  }
}
