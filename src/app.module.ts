import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LikeModule } from './like/like.module';
import { StickerModule } from './sticker/sticker.module';
import { SuggestionModule } from './suggestion/suggestion.module';
import { UpvoteModule } from './upvote/upvote.module';
import { PrismaModule } from './prisma/prisma.module';
import { ArticleModule } from './article/article.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ArticleModule,
    CommentModule,
    LikeModule,
    UpvoteModule,
    SuggestionModule,
    StickerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
