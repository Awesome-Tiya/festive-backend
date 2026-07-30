import { IsString, IsEmail } from 'class-validator';

export class CreateSuggestionDto {
  @IsEmail()
  email!: string;

  @IsString()
  suggestion!: string;
}
