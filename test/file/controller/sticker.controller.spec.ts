import { Test } from '@nestjs/testing';
import { StickerController } from '../../../src/sticker/sticker.controller';
import { StickerService } from '../../../src/sticker/sticker.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { JwtAuthGuard } from '../../../src/auth/jwt.strategy';
import { CreateStickerDto } from 'src/sticker/dto/create-sticker.dto';

describe('StickerController', () => {
  let controller: StickerController;

  const mockStickerService = {
    putSticker: jest.fn(),
    getStickers: jest.fn(),
    removeSticker: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [StickerController],
      providers: [
        {
          provide: StickerService,
          useValue: mockStickerService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    controller = module.get(StickerController);
  });

  const dto: CreateStickerDto = {
    name: 'chinese-lantern',
    x: 50,
    y: 50,
  };

  it('should call putSticker', async () => {
    await controller.putSticker('1', dto, { userId: '1' });

    expect(mockStickerService.putSticker).toHaveBeenCalledWith('1', dto, '1');
  });

  it('should call getStickers', async () => {
    await controller.getStickers('1');

    expect(mockStickerService.getStickers).toHaveBeenCalledWith('1');
  });

  it('should call removeSticker', async () => {
    await controller.removeSticker('1', 'sticker1');

    expect(mockStickerService.removeSticker).toHaveBeenCalledWith(
      '1',
      'sticker1',
    );
  });
});
