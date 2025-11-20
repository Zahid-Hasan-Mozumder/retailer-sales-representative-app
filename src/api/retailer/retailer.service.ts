import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  RetailerResponseDto,
  UpdateRetailerDto,
  RetailersQueryDto,
  RetailersQueryResponseDto,
} from './dto';
import { User } from '../../common/interfaces';
import { Role } from '../../common/enums';
import { getRetailersQuery } from './queries/get-retailers.query';
import { countRetailersQuery } from './queries/count-retailers.query';
import { Retailer } from 'generated/prisma/client';

@Injectable()
export class RetailerService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllQuery(
    dto: RetailersQueryDto,
    user: User,
  ): Promise<RetailersQueryResponseDto> {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const offset = (page - 1) * limit;
    const role = user.role;
    const [items, totalRows] = await Promise.all([
      this.prisma.$queryRaw<Retailer[]>(
        getRetailersQuery(
          role,
          user.id?.toString(),
          dto.search,
          dto.sort?.name,
          dto.sort?.updatedAt,
          dto.sort?.createdAt,
          offset,
          limit,
          dto.filter?.regionId,
          dto.filter?.areaId,
          dto.filter?.distributorId,
          dto.filter?.territoryId,
        ),
      ),
      this.prisma.$queryRaw<{ count: bigint }[]>(
        countRetailersQuery(
          role,
          user.id?.toString(),
          dto.search,
          dto.filter?.regionId,
          dto.filter?.areaId,
          dto.filter?.distributorId,
          dto.filter?.territoryId,
        ),
      ),
    ]);
    const total = Number(totalRows[0]?.count ?? 0);
    return new RetailersQueryResponseDto(items, total, page, limit);
  }

  // async findByUid(user: User, uid: string): Promise<RetailerResponseDto> {
  //   const retailer = await this.prisma.retailer.findUnique({ where: { uid } });
  //   if (!retailer) throw new NotFoundException('Retailer not found');
  //   const isAdmin = user.role === Role.ADMIN;
  //   if (!isAdmin && retailer.salesRepId !== Number(user.id))
  //     throw new NotFoundException('Retailer not found');
  //   return retailer as RetailerResponseDto;
  // }

  // async update(
  //   user: User,
  //   uid: string,
  //   dto: UpdateRetailerDto,
  // ): Promise<RetailerResponseDto> {
  //   const existing = await this.prisma.retailer.findUnique({ where: { uid } });
  //   if (!existing) throw new NotFoundException('Retailer not found');
  //   const isAdmin = user.role === Role.ADMIN;
  //   if (!isAdmin && existing.salesRepId !== Number(user.id))
  //     throw new ForbiddenException('Not allowed');
  //   const updated = await this.prisma.retailer.update({
  //     where: { uid },
  //     data: {
  //       ...(dto.name !== undefined ? { name: dto.name } : {}),
  //       ...(dto.phone !== undefined ? { phone: dto.phone } : {}),
  //       ...(dto.routes !== undefined ? { routes: dto.routes } : {}),
  //     },
  //   });
  //   return updated as RetailerResponseDto;
  // }
}
