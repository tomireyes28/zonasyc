import { Controller, Get, Post, Body, UseGuards, Headers, UnauthorizedException, Param, Patch } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AiDraftDto } from './dto/ai-draft.dto';
import { PrismaService } from '../prisma/prisma.service'; 
import { UpdateArticleStatusDto } from './dto/update-article-status.dto';
import { ArticleStatus } from '@prisma/client'; // <-- 1. Importamos el tipo estricto de Prisma

@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private prisma: PrismaService 
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('kanban')
  getKanbanBoard() {
    return this.articlesService.getKanbanBoard();
  }

  @Post('webhook/ai-draft')
  createAiDraft(
    @Headers('x-api-key') apiKey: string,
    @Body() aiDraftDto: AiDraftDto
  ) {
    const expectedKey = process.env.MAKE_API_KEY || 'llave-secreta-make-zonasyc';
    if (apiKey !== expectedKey) {
      throw new UnauthorizedException('API Key inválida');
    }
    return this.articlesService.createAiDraft(aiDraftDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateArticleStatusDto
  ) {
    // 2. Casteamos el string a ArticleStatus para que TypeScript se quede tranquilo
    return this.articlesService.updateStatus(id, updateDto.status as ArticleStatus);
  }
}