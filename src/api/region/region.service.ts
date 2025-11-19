import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRegionDto, UpdateRegionDto, RegionResponseDto } from './dto';
import { DeleteResponseDto } from '../../common/dto';

@Injectable()
export class RegionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRegionDto): Promise<RegionResponseDto> {
    return this.prisma.region.create({ data: { name: dto.name } });
  }

  async findAll(): Promise<RegionResponseDto[]> {
    return this.prisma.region.findMany();
  }

  async findOne(id: number): Promise<RegionResponseDto> {
    const region = await this.prisma.region.findUnique({ where: { id } });
    if (!region) throw new NotFoundException('Region not found');
    return region;
  }

  async update(id: number, dto: UpdateRegionDto): Promise<RegionResponseDto> {
    await this.findOne(id);
    return this.prisma.region.update({
      where: { id },
      data: { ...(dto.name !== undefined ? { name: dto.name } : {}) },
    });
  }

  async remove(id: number): Promise<DeleteResponseDto> {
    await this.findOne(id);
    await this.prisma.region.delete({ where: { id } });
    return { success: true };
  }
}
