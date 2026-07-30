import { Module } from '@nestjs/common';
import { SuggestionService } from './suggestion.service';
import { AuthModule } from 'src/auth/auth.module';
import { SuggestionController } from './suggestion.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [SuggestionService],
  controllers: [SuggestionController],
  exports: [SuggestionService],
})
export class SuggestionModule {}
