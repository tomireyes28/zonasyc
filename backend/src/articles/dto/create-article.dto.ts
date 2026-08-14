import { IsString, IsNotEmpty, IsOptional, IsArray, IsEnum } from 'class-validator';
import { ArticleStatus } from '@prisma/client';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  title!: string; // <-- Agregamos el !

  @IsString()
  @IsNotEmpty()
  slug!: string; // <-- Agregamos el !

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  coverImage?: string; 

  @IsString()
  @IsNotEmpty()
  category!: string; // <-- Agregamos el !

  @IsArray()
  @IsString({ each: true })
  tags!: string[]; // <-- Agregamos el !

  @IsEnum(ArticleStatus)
  @IsOptional()
  status?: ArticleStatus;
}