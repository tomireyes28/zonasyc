import { Controller, Get, Param } from '@nestjs/common';
import { ArticlesService } from './articles.service';

@Controller('public/articles') // <-- Definimos la ruta base pública
export class PublicArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get('latest')
  async getLatest() {
    return this.articlesService.getLatestPublic();
  }

  @Get('category/:slug')
  async getByCategory(@Param('slug') slug: string) {
    return this.articlesService.getPublicByCategory(slug);
  }

  @Get(':slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.articlesService.getPublicBySlug(slug);
  }
}