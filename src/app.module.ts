import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { PasswordModule } from './password/password.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ConfigModule, PasswordModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
