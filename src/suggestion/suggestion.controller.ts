import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';
import { JwtAuthGuard } from 'src/auth/jwt.strategy';
import type { JwtPayload } from '../auth/auth-request.interface';
import { SuggestionService } from './suggestion.service';
import { User } from 'src/auth/user.decorator';

@Controller('festive')
export class SuggestionController {
  constructor(private readonly suggestionService: SuggestionService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/suggestion')
  async createSuggestion(
    @Body() createSuggestionDto: CreateSuggestionDto,
    @User() user: JwtPayload,
  ) {
    return this.suggestionService.createSuggestion(
      createSuggestionDto,
      user.userId,
    );
  }
}
