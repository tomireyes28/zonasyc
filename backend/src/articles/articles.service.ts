import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiDraftDto } from './dto/ai-draft.dto';
import { ArticleStatus } from '@prisma/client'; 
import { CreateArticleDto } from './dto/create-article.dto';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async create(createArticleDto: CreateArticleDto, userId: string) {
    return this.prisma.article.create({
      data: {
        title: createArticleDto.title,
        slug: createArticleDto.slug,
        content: createArticleDto.content || '',
        cover_image_url: createArticleDto.coverImage, // Mapeado exacto a tu schema
        status: createArticleDto.status || ArticleStatus.DRAFT,
        
        // Relación con el autor
        author: {
          connect: { id: userId }
        },
        
        // Relación con Categoría (conecta si existe, crea si no existe)
        category: {
          connectOrCreate: {
            where: { name: createArticleDto.category },
            create: {
              name: createArticleDto.category,
              slug: createArticleDto.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-')
            }
          }
        },

        // Relación Muchos-a-Muchos con Tags
        tags: {
          connectOrCreate: createArticleDto.tags.map(tag => ({
            where: { name: tag },
            create: {
              name: tag,
              slug: tag.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-')
            }
          }))
        }
      },
    });
  }

  async getKanbanBoard() {
    const articles = await this.prisma.article.findMany({
      orderBy: { updatedAt: 'desc' },
      include: { 
        author: { select: { name: true, avatar_url: true } } 
      }
    });

    return {
      ideas: articles.filter(a => a.status === 'IDEA'),
      drafts: articles.filter(a => a.status === 'DRAFT'),
      reviews: articles.filter(a => a.status === 'REVIEW'),
      published: articles.filter(a => a.status === 'PUBLISHED'),
    };
  }

  async createAiDraft(data: AiDraftDto) {
    const admin = await this.prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (!admin) {
      throw new Error('No se encontró un administrador para asignar la nota generada por IA');
    }

    const slug = data.title
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, ''); 

    return this.prisma.article.create({
      data: {
        title: data.title,
        slug: slug + '-' + Math.floor(Math.random() * 1000),
        content: data.content,
        source_url: data.source_url,
        cover_image_url: data.cover_image_url,
        status: 'DRAFT',
        is_ai_generated: true,
        authorId: admin.id,
      }
    });
  }

  async updateStatus(id: string, status: ArticleStatus) {
    return this.prisma.article.update({
      where: { id },
      data: { 
        status
      }
    });
  }
}