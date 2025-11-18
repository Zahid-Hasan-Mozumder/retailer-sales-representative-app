import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { PasswordService } from '../../password/password.service';
import { ConfigModule } from '../../config/config.module';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '../../cache/cache.module';
import {
  AccessTokenStrategy,
  RefreshTokenStrategy,
} from '../../common/strategies';

@Module({
  imports: [PrismaModule, ConfigModule, JwtModule, CacheModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
