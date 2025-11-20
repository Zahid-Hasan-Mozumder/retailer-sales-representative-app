import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { PasswordModule } from './password/password.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './api/auth/auth.module';
import { CacheModule } from './cache/cache.module';
import { CsvModule } from './csv/csv.module';
import { RegionModule } from './api/region/region.module';
import { AreaModule } from './api/area/area.module';
import { TerritoryModule } from './api/territory/territory.module';
import { DistributorModule } from './api/distributor/distributor.module';
import { AdminModule } from './api/admin/admin.module';
import { RetailerModule } from './api/retailer/retailer.module';

@Module({
  imports: [
    ConfigModule,
    PasswordModule,
    PrismaModule,
    AuthModule,
    CacheModule,
    CsvModule,
    RegionModule,
    AreaModule,
    TerritoryModule,
    DistributorModule,
    AdminModule,
    RetailerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
