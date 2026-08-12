import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class AiDraftDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  source_url?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  cover_image_url?: string;
}