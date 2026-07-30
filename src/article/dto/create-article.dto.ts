import { IsString, IsOptional } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  text!: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  album!: string;
}
