// src/upload/upload.controller.ts
import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // Protegemos la ruta para que solo los redactores puedan subir fotos
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file')) // Intercepta el campo 'file' del FormData
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // Límite de 5MB para cuidar el Core Web Vitals
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          // Solo aceptamos formatos de imagen web
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
        ],
      }),
    ) file: Express.Multer.File,
  ) {
    const url = await this.uploadService.uploadImage(file);
    // Devolvemos un JSON estándar con la URL
    return { url };
  }
}