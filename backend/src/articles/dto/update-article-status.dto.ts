// src/articles/dto/update-article-status.dto.ts
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

// Usamos un array con los estados exactos que definiste en tu schema.prisma
const validStatuses = ['IDEA', 'DRAFT', 'REVIEW', 'PUBLISHED'];

export class UpdateArticleStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(validStatuses, { message: 'El estado provisto no es válido para el Kanban' })
  status!: string;
}