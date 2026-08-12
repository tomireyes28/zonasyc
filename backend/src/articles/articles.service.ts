import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiDraftDto } from './dto/ai-draft.dto';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async getKanbanBoard() {
    // Traemos todo ordenado por fecha y sumamos los datos básicos del autor
    const articles = await this.prisma.article.findMany({
      orderBy: { updatedAt: 'desc' },
      include: { 
        author: { select: { name: true, avatar_url: true } } 
      }
    });

    // Filtramos y devolvemos el objeto listo para que el frontend lo mapée
    return {
      ideas: articles.filter(a => a.status === 'IDEA'),
      drafts: articles.filter(a => a.status === 'DRAFT'),
      reviews: articles.filter(a => a.status === 'REVIEW'),
      published: articles.filter(a => a.status === 'PUBLISHED'),
    };
  }

  async createAiDraft(data: AiDraftDto) {
    // Como es la IA quien lo crea, buscamos a un Administrador para asignarle la autoría temporalmente
    const admin = await this.prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (!admin) {
      throw new Error('No se encontró un administrador para asignar la nota generada por IA');
    }

    // Generamos un slug simple a partir del título
    const slug = data.title
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Saca los acentos
      .replace(/[^a-z0-9]+/g, '-') // Reemplaza espacios por guiones
      .replace(/(^-|-$)+/g, ''); 

    return this.prisma.article.create({
      data: {
        title: data.title,
        slug: slug + '-' + Math.floor(Math.random() * 1000), // Evitamos slugs duplicados
        content: data.content,
        source_url: data.source_url,
        cover_image_url: data.cover_image_url,
        status: 'DRAFT', // Lo mandamos directo a la columna de "En Redacción"
        is_ai_generated: true,
        authorId: admin.id,
      }
    });
  }
}