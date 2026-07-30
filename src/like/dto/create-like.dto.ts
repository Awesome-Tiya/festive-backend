import { IsString } from 'class-validator';

export class CreateLikeDto {
  @IsString()
  commentId!: string;
}
