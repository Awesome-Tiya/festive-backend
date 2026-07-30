import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';

@Injectable()
export class SuggestionService {
  constructor(private prisma: PrismaService) {}

  async createSuggestion(
    createSuggestionDto: CreateSuggestionDto,
    userId: string,
  ) {
    return this.prisma.suggestion.create({
      data: {
        username: userId,
        suggestion: createSuggestionDto.suggestion,
        email: createSuggestionDto.email,
        createdAt: new Date(),
      },
    });
  }
}
