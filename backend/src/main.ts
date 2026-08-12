import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Corta y elimina cualquier campo extra (basura) que mande el frontend o un atacante
      forbidNonWhitelisted: true, // Si mandan campos que no están en el DTO, rechaza la petición directamente
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
