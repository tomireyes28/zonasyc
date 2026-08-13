import { Controller, Get, Post, Body, UseGuards, Headers, UnauthorizedException } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AiDraftDto } from './dto/ai-draft.dto';
import { PrismaService } from '../prisma/prisma.service'; 

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
}