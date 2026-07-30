import { Test } from '@nestjs/testing';
import { SuggestionController } from '../../../src/suggestion/suggestion.controller';
import { SuggestionService } from '../../../src/suggestion/suggestion.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { JwtAuthGuard } from '../../../src/auth/jwt.strategy';
import { CreateSuggestionDto } from 'src/suggestion/dto/create-suggestion.dto';

describe('SuggestionController', () => {
  let controller: SuggestionController;

  const mockSuggestionService = {
    createSuggestion: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [SuggestionController],
      providers: [
        {
          provide: SuggestionService,
          useValue: mockSuggestionService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    controller = module.get(SuggestionController);
  });

  const dto: CreateSuggestionDto = {
    email: 'email@example.com',
    suggestion: 'Sample suggestion',
  };

  it('should call createSuggestion', async () => {
    await controller.createSuggestion(dto, { userId: '1' });

    expect(mockSuggestionService.createSuggestion).toHaveBeenCalledWith(
      dto,
      '1',
    );
  });
});
