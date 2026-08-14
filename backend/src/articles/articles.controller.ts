import { Controller, Get, Post, Body, UseGuards, Headers, UnauthorizedException, Param, Patch, Request } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AiDraftDto } from './dto/ai-draft.dto';
import { PrismaService } from '../prisma/prisma.service'; 
import { UpdateArticleStatusDto } from './dto/update-article-status.dto';
import { ArticleStatus } from '@prisma/client';
import { CreateArticleDto } from './dto/create-article.dto';

// Definimos el tipado estricto para evitar usar 'any'
interface RequestWithUser {
  user: {
    id?: string;
    sub?: string;
    userId?: string;
  };
}

@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private prisma: PrismaService 
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createArticleDto: CreateArticleDto, 
    @Request() req: RequestWithUser
  ) {
    // Extraemos el ID de forma segura según el estándar JWT que estés usando
    const userId = req.user.id || req.user.sub || req.user.userId;

    if (!userId) {
      throw new UnauthorizedException('No se pudo identificar al autor desde el token de sesión');
    }

    return this.articlesService.create(createArticleDto, userId);
  }

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
    return this.articlesService.updateStatus(id, updateDto.status as ArticleStatus);
  }
}