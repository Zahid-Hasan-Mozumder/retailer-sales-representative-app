import { Module } from '@nestjs/common';
import { CacheModule as CacheModuleType } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { ConfigService } from '../config/config.service';
import { ConfigModule } from '../config/config.module';
import { CacheService } from './cache.service';

@Module({
  imports: [
    CacheModuleType.registerAsync({
      imports: [ConfigModule],
      isGlobal: true,
      useFactory: async (config: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: config.redisHost,
            port: config.redisPort,
          },
          username: config.redisUsername,
          password: config.redisPassword,
          ttl: 3600,
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
