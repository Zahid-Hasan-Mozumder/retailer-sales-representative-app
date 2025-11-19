import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateTerritoryDto,
  UpdateTerritoryDto,
  TerritoryResponseDto,
} from './dto';
import { DeleteResponseDto } from '../../common/dto';

@Injectable()
export class TerritoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTerritoryDto): Promise<TerritoryResponseDto> {
    const area = await this.prisma.area.findUnique({
      where: { id: dto.areaId },
    });
    if (!area) throw new NotFoundException('Area not found');
    return this.prisma.territory.create({
      data: { name: dto.name, areaId: dto.areaId },
    });
  }

  async findAll(): Promise<TerritoryResponseDto[]> {
    return this.prisma.territory.findMany();
  }

  async findOne(id: number): Promise<TerritoryResponseDto> {
    const territory = await this.prisma.territory.findUnique({ where: { id } });
    if (!territory) throw new NotFoundException('Territory not found');
    return territory;
  }

  async update(
    id: number,
    dto: UpdateTerritoryDto,
  ): Promise<TerritoryResponseDto> {
    await this.findOne(id);
    if (dto.areaId !== undefined) {
      const area = await this.prisma.area.findUnique({
        where: { id: dto.areaId },
      });
      if (!area) throw new NotFoundException('Area not found');
    }
    return this.prisma.territory.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.areaId !== undefined ? { areaId: dto.areaId } : {}),
      },
    });
  }

  async remove(id: number): Promise<DeleteResponseDto> {
    await this.findOne(id);
    await this.prisma.territory.delete({ where: { id } });
    return { success: true };
  }
}
