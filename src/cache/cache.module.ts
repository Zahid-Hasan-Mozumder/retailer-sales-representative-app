import { Module } from '@nestjs/common';
import { CacheModule as CacheModuleType } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { ConfigService } from '../config/config.service';
import { ConfigModule } from '../config/config.module';
import { CacheService } from './cache.service';

@Module({
  imports: [
    CacheModuleType.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          store: await redisStore({
            url: config.redisUrl,
          }),
        };
      },
      isGlobal: true,
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
