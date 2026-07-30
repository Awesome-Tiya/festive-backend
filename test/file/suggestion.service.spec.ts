import { describe, jest, it, expect, beforeEach } from '@jest/globals';
import { SuggestionService } from '../../src/suggestion/suggestion.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('SuggestionService', () => {
  let suggestionService: SuggestionService;

  const mockPrismaService = {
    suggestion: {
      create: jest.fn(),
    },
  } as unknown as jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuggestionService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    suggestionService = module.get<SuggestionService>(SuggestionService);

    jest.clearAllMocks();
  });

  describe('createSuggestion', () => {
    it('should create a suggestion', async () => {
      const suggestion = {
        suggestion: 'This is a suggestion',
        username: 'user1',
        id: 'suggestion1',
        email: 'email@domain.com',
        createdAt: new Date(),
      };

      mockPrismaService.suggestion.create.mockResolvedValue(suggestion);

      const result = await suggestionService.createSuggestion(
        suggestion,
        'user1',
      );

      expect(result).toEqual(suggestion);
    });
  });
});
