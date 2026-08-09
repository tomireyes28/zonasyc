import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

// 1. Definimos exactamente qué trae nuestro token
interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

// 2. Extendemos el Request de Express para avisarle que ahora trae un usuario
interface RequestWithUser extends Request {
  user?: JwtPayload;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Le decimos a TypeScript exactamente qué tipo de Request estamos manejando
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('Token no encontrado');
    }
    
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SECRET || 'super-secreto-zonasyc',
      });
      // Ahora sí podemos asignar el payload sin errores de tipo "any"
      request.user = payload;
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
    
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}