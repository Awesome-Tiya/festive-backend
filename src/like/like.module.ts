import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { AuthModule } from 'src/auth/auth.module';
import { LikeController } from './like.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [LikeService],
  controllers: [LikeController],
  exports: [LikeService],
})
export class LikeModule {}
