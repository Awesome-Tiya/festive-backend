import { IsString } from 'class-validator';

export class CreateUpvoteDto {
  @IsString()
  articleId!: string;
}
