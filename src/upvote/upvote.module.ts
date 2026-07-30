import { Module } from '@nestjs/common';
import { UpvoteService } from './upvote.service';
import { AuthModule } from 'src/auth/auth.module';
import { UpvoteController } from './upvote.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [UpvoteService],
  controllers: [UpvoteController],
  exports: [UpvoteService],
})
export class UpvoteModule {}
