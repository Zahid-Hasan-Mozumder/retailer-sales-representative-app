import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { PasswordModule } from './password/password.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './api/auth/auth.module';
import { CacheModule } from './cache/cache.module';
import { RegionModule } from './api/region/region.module';
import { AreaModule } from './api/area/area.module';
import { TerritoryModule } from './api/territory/territory.module';
import { DistributorModule } from './api/distributor/distributor.module';

@Module({
  imports: [
    ConfigModule,
    PasswordModule,
    PrismaModule,
    AuthModule,
    CacheModule,
    RegionModule,
    AreaModule,
    TerritoryModule,
    DistributorModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
