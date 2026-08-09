import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  exports: [UsersService], // <-- Agregamos esto para que Auth pueda usarlo
})
export class UsersModule {}