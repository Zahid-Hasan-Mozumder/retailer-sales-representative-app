import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { PasswordModule } from './password/password.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './api/auth/auth.module';
import { CacheModule } from './cache/cache.module';
import { CsvModule } from './csv/csv.module';

@Module({
  imports: [
    ConfigModule,
    PasswordModule,
    PrismaModule,
    AuthModule,
    CacheModule,
    CsvModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
