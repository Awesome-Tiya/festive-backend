import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentFlagReason, Prisma } from '@prisma/client';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async createComment(
    articleId: string,
    dto: CreateCommentDto,
    userId: string,
  ) {
    try {
      const article = await this.prisma.article.findUnique({
        where: { id: articleId },
      });
      if (!article) throw new NotFoundException('Article not found');

      const comment = await this.prisma.comment.create({
        data: {
          articleId: articleId,
          username: userId,
          isFlag: false,
          comment: dto.comment,
          time: new Date(),
        },
      });

      return comment;
    } catch (error) {
      console.log('Error creating comment:', error);
      throw error;
    }
  }
  async getTopComment(articleId: string) {
    try {
      const comment = await this.prisma.comment.findMany({
        where: { articleId, isFlag: false },
        include: { _count: { select: { likes: true } } },
      });
      if (comment.length === 0)
        throw new NotFoundException(
          'No comments or comments with likes found for this article',
        );
      const maxLiked = Math.max(...comment.map((c) => c._count.likes));
      const topComments = comment.filter((c) => c._count.likes === maxLiked);
      const selected =
        topComments[Math.floor(Math.random() * topComments.length)];
      return selected;
    } catch (error) {
      console.log('Error retrieving top comment:', error);
      throw error;
    }
  }

  async getComments(articleId: string, limit: number, cursor?: string) {
    try {
      return await this.prisma.comment.findMany({
        where: {
          articleId,
          isFlag: false,
        },
        take: limit,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        include: { _count: { select: { likes: true } } },
        orderBy: { time: 'desc' },
      });
    } catch (error) {
      console.log('Error retrieving comments:', error);
      throw error;
    }
  }

  async flagComment(
    commentId: string,
    reason: CommentFlagReason,
    userId: string,
  ) {
    try {
      const comment = await this.prisma.comment.findUnique({
        where: { id: commentId },
      });
      if (!comment) throw new NotFoundException('Comment not found');
      if (comment.isFlag)
        return { message: 'Comment is already hidden due to flags' };
      const flaggedComment = await this.prisma.commentFlag.create({
        data: {
          commentId: commentId,
          reason: reason,
          username: userId,
          createdAt: new Date(),
        },
      });
      const numberOfFlags = await this.prisma.commentFlag.count({
        where: { commentId: commentId },
      });
      if (numberOfFlags >= 3) {
        await this.prisma.comment.update({
          where: { id: commentId },
          data: { isFlag: true },
        });
      }
      return { message: 'Comment flagged', flaggedComment: flaggedComment };
    } catch (error) {
      console.log('Error flagging comment:', error);
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      )
        return { message: 'You have already flagged this comment' };
      throw error;
    }
  }

  async deleteComment(commentId: string) {
    try {
      const comment = await this.prisma.comment.findUnique({
        where: { id: commentId },
      });
      if (!comment) throw new NotFoundException('Comment not found');
      await this.prisma.comment.delete({ where: { id: commentId } });
      return { message: 'Comment deleted' };
    } catch (error) {
      console.log('Error deleting comment:', error);
      throw error;
    }
  }
}
