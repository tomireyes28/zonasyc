import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      // La clave secreta la leeremos del .env, pero dejamos un fallback temporal por seguridad
      secret: process.env.JWT_SECRET || 'super-secreto-zonasyc', 
      signOptions: { expiresIn: '7d' }, // El token durará 1 semana
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}