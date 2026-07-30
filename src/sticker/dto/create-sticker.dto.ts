import { IsString, IsNumber } from 'class-validator';

export class CreateStickerDto {
  @IsString()
  name!: string;

  @IsNumber()
  x!: number;

  @IsNumber()
  y!: number;
}
