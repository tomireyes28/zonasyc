// src/upload/upload.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Multer from 'multer';

@Injectable()
export class UploadService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    // Inicializamos el cliente con nivel "Administrador"
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL') as string,
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') as string,
    );
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const bucket = this.configService.get<string>('SUPABASE_BUCKET_NAME') || 'zonasyc-media';
    
    // Generamos un nombre único: timestamp + número aleatorio + extensión original
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`;
    const filePath = `articles/${fileName}`; // Lo guarda en la carpeta "articles" dentro del bucket

    // Subimos el buffer directamente a Supabase
    const { error } = await this.supabase.storage
      .from(bucket)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new InternalServerErrorException(`Error al subir imagen: ${error.message}`);
    }

    // Obtenemos la URL pública para devolverla al frontend
    const { data } = this.supabase.storage.from(bucket).getPublicUrl(filePath);

    return data.publicUrl;
  }
}