import { Controller, Get, Post, Body, UseGuards, Headers, UnauthorizedException } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AiDraftDto } from './dto/ai-draft.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  // 1. Endpoint protegido para tu panel frontend
  @UseGuards(JwtAuthGuard)
  @Get('kanban')
  getKanbanBoard() {
    return this.articlesService.getKanbanBoard();
  }

  // 2. Webhook oculto para Make.com (Sin JWT, usa API Key)
  @Post('webhook/ai-draft')
  createAiDraft(
    @Headers('x-api-key') apiKey: string,
    @Body() aiDraftDto: AiDraftDto
  ) {
    // Chequeamos que la petición venga de tu escenario de Make.com
    const expectedKey = process.env.MAKE_API_KEY || 'llave-secreta-make-zonasyc';
    if (apiKey !== expectedKey) {
      throw new UnauthorizedException('API Key inválida para inyección de borradores');
    }

    return this.articlesService.createAiDraft(aiDraftDto);
  }
}