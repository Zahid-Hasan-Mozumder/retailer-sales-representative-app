import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { PasswordModule } from './password/password.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './api/auth/auth.module';

@Module({
  imports: [ConfigModule, PasswordModule, PrismaModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
