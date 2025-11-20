import { Module } from '@nestjs/common';
import { RetailerController } from './retailer.controller';
import { RetailerService } from './retailer.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RetailerController],
  providers: [RetailerService],
})
export class RetailerModule {}
