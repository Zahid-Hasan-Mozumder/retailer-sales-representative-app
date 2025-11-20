import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findByUid(user: User, uid: string): Promise<RetailerResponseDto> {
    let retailer: Retailer | null = null;
    if (user.role === Role.ADMIN) {
      retailer = await this.prisma.retailer.findUnique({
        where: { uid },
      });
    } else {
      retailer = await this.prisma.retailer.findFirst({
        where: {
          uid,
          assignments: {
            some: {
              salesRepId: Number(user.id),
            },
          },
        },
      });
    }
    if (!retailer) throw new NotFoundException('Retailer not found');
    return retailer as RetailerResponseDto;
  }

  async update(
    user: User,
    uid: string,
    dto: UpdateRetailerDto,
  ): Promise<RetailerResponseDto> {
    let updatedRetailer: Retailer | null = null;
    if (user.role === Role.ADMIN) {
      updatedRetailer = await this.prisma.retailer.update({
        where: { uid },
        data: {
          ...(dto.name !== undefined ? { name: dto.name } : {}),
          ...(dto.phone !== undefined ? { phone: dto.phone } : {}),
          ...(dto.regionId !== undefined ? { regionId: dto.regionId } : {}),
          ...(dto.areaId !== undefined ? { areaId: dto.areaId } : {}),
          ...(dto.distributorId !== undefined
            ? { distributorId: dto.distributorId }
            : {}),
          ...(dto.territoryId !== undefined
            ? { territoryId: dto.territoryId }
            : {}),
          ...(dto.routes !== undefined ? { routes: dto.routes } : {}),
        },
      });
    } else {
      updatedRetailer = await this.prisma.retailer.update({
        where: {
          uid,
          assignments: {
            some: {
              salesRepId: Number(user.id),
            },
          },
        },
        data: {
          ...(dto.name !== undefined ? { name: dto.name } : {}),
          ...(dto.phone !== undefined ? { phone: dto.phone } : {}),
          ...(dto.regionId !== undefined ? { regionId: dto.regionId } : {}),
          ...(dto.areaId !== undefined ? { areaId: dto.areaId } : {}),
          ...(dto.distributorId !== undefined
            ? { distributorId: dto.distributorId }
            : {}),
          ...(dto.territoryId !== undefined
            ? { territoryId: dto.territoryId }
            : {}),
          ...(dto.routes !== undefined ? { routes: dto.routes } : {}),
        },
      });
    }
    if (!updatedRetailer) throw new NotFoundException('Retailer not found');
    return updatedRetailer as RetailerResponseDto;
  }
}
