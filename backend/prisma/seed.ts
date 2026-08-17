import { PrismaClient, ArticleStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// 1. Cargamos las variables de entorno manualmente porque estamos fuera de NestJS
dotenv.config();

// 2. Armamos el Driver Adapter que exige Prisma 7
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Iniciando el sembrado de datos (Seed)...');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@zonasyc.com' },
    update: {},
    create: {
      email: 'admin@zonasyc.com',
      password: 'no-importa-el-hash-aca',
      name: 'Redacción Zonasyc',
      role: 'ADMIN',
    },
  });

  const dummyArticles = [
    { 
      title: "GTA VI: Rockstar confirma detalles del nuevo motor gráfico y físicas hiperrealistas", 
      slug: "gta-vi-detalles-motor-grafico", 
      cat: "Gaming", 
      img: "https://images.unsplash.com/photo-1606144042871-202a0f8ad155?q=80&w=1200&auto=format&fit=crop" 
    },
    { 
      title: "El renacimiento del terror indie: Las joyas ocultas de este año", 
      slug: "cine-terror-indie-joyas", 
      cat: "Cine", 
      img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop" 
    },
    { 
      title: "Review: El RPG que rompe todos los esquemas del mercado actual", 
      slug: "review-rpg-rompe-esquemas", 
      cat: "Gaming", 
      img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop" 
    },
    { 
      title: "Las series de ciencia ficción más esperadas para el próximo semestre", 
      slug: "series-scifi-esperadas", 
      cat: "Series", 
      img: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=800&auto=format&fit=crop" 
    },
    { 
      title: "Evolución técnica: ¿Llegamos al techo de los gráficos en consolas?", 
      slug: "evolucion-tecnica-consolas", 
      cat: "Gaming", 
      img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop" 
    },
  ];

  for (const item of dummyArticles) {
    await prisma.article.upsert({
      where: { slug: item.slug },
      update: {},
      create: {
        title: item.title,
        slug: item.slug,
        content: "<p>Este es un texto de prueba generado por el seed de Prisma. Acá irá el contenido real en formato HTML inyectado por TipTap.</p><h2>Un subtítulo de prueba</h2><p>Más texto de relleno para validar la maquetación de la nota individual cuando la armemos.</p>",
        cover_image_url: item.img,
        status: ArticleStatus.PUBLISHED, 
        publishedAt: new Date(),
        author: {
          connect: { id: admin.id }
        },
        category: {
          connectOrCreate: {
            where: { name: item.cat },
            create: { name: item.cat, slug: item.cat.toLowerCase() }
          }
        }
      }
    });
  }

  console.log('✅ Base de datos poblada con éxito. ¡Refrescá la Home!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });