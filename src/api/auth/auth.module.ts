import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { PasswordService } from '../../password/password.service';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, PasswordService],
})
export class AuthModule {}
