// src/articles/articles.module.ts
import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module'; // <-- IMPORTAMOS EL MÓDULO
import { PublicArticlesController } from './public-articles.controller';

@Module({
  imports: [PrismaModule, AuthModule], // <-- LO AGREGAMOS AL ARRAY
  providers: [ArticlesService],
  controllers: [ArticlesController, PublicArticlesController], // <-- AGREGAMOS EL CONTROLADOR PÚBLICO
})
export class ArticlesModule {}