import { Module } from '@nestjs/common';
import { StickerService } from './sticker.service';
import { StickerController } from './sticker.controller';
import { AuthModule } from 'src/auth/auth.module';
import { StickerGateway } from './sticker.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [StickerService, StickerGateway],
  controllers: [StickerController],
  exports: [StickerService, StickerGateway],
})
export class StickerModule {}
