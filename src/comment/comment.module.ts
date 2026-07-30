import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthModule } from 'src/auth/auth.module';
import { CommentController } from './comment.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [CommentService],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}
