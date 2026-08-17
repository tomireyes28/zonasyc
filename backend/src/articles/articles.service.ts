import { Injectable, NotFoundException } from '@nestjs/common'; // <-- Agregado NotFoundException acá arriba
import { PrismaService } from '../prisma/prisma.service';
import { AiDraftDto } from './dto/ai-draft.dto';
import { ArticleStatus } from '@prisma/client'; 
import { CreateArticleDto } from './dto/create-article.dto';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async create(createArticleDto: CreateArticleDto, userId: string) {
    const isPublished = createArticleDto.status === ArticleStatus.PUBLISHED;

    return this.prisma.article.create({
      data: {
        title: createArticleDto.title,
        slug: createArticleDto.slug,
        content: createArticleDto.content || '',
        cover_image_url: createArticleDto.coverImage,
        status: createArticleDto.status || ArticleStatus.DRAFT,
        publishedAt: isPublished ? new Date() : null, // <-- El registro del timestamp
        
        author: {
          connect: { id: userId }
        },
        category: {
          connectOrCreate: {
            where: { name: createArticleDto.category },
            create: {
              name: createArticleDto.category,
              slug: createArticleDto.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-')
            }
          }
        },
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
    const isPublished = status === ArticleStatus.PUBLISHED;
    
    return this.prisma.article.update({
      where: { id },
      data: { 
        status,
        publishedAt: isPublished ? new Date() : null, // <-- El registro del timestamp
      }
    });
  }

  // --- ENDPOINTS PÚBLICOS (DÍA 17) ---

  async getLatestPublic() {
    return this.prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 20, // Traemos solo las últimas 20 para no saturar la página de inicio
      include: {
        author: { select: { name: true, avatar_url: true } },
        category: true,
        tags: true,
      }
    });
  }

  async getPublicByCategory(categorySlug: string) {
    return this.prisma.article.findMany({
      where: { 
        status: 'PUBLISHED',
        category: { slug: categorySlug }
      },
      orderBy: { publishedAt: 'desc' },
      include: {
        author: { select: { name: true, avatar_url: true } },
        category: true,
        tags: true,
      }
    });
  }

  async getPublicBySlug(slug: string) {
    // Usamos findFirst y chequeamos que esté en PUBLISHED para que nadie lea borradores
    const article = await this.prisma.article.findFirst({
      where: { 
        slug,
        status: 'PUBLISHED' 
      },
      include: {
        author: { select: { name: true, avatar_url: true, bio: true, social_links: true } },
        category: true,
        tags: true,
      }
    });

    if (!article) {
      // Ya no usamos require(), lanzamos la excepción importada arriba
      throw new NotFoundException(`No se encontró el artículo con el slug: ${slug}`);
    }

    return article;
  }
}