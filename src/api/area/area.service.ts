import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAreaDto, UpdateAreaDto, AreaResponseDto } from './dto';
import { DeleteResponseDto } from '../../common/dto';

@Injectable()
export class AreaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAreaDto): Promise<AreaResponseDto> {
    const region = await this.prisma.region.findUnique({
      where: { id: dto.regionId },
    });
    if (!region) throw new NotFoundException('Region not found');
    return this.prisma.area.create({
      data: { name: dto.name, regionId: dto.regionId },
    });
  }

  async findAll(): Promise<AreaResponseDto[]> {
    return this.prisma.area.findMany();
  }

  async findOne(id: number): Promise<AreaResponseDto> {
    const area = await this.prisma.area.findUnique({ where: { id } });
    if (!area) throw new NotFoundException('Area not found');
    return area;
  }

  async update(id: number, dto: UpdateAreaDto): Promise<AreaResponseDto> {
    await this.findOne(id);
    if (dto.regionId !== undefined) {
      const region = await this.prisma.region.findUnique({
        where: { id: dto.regionId },
      });
      if (!region) throw new NotFoundException('Region not found');
    }
    return this.prisma.area.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.regionId !== undefined ? { regionId: dto.regionId } : {}),
      },
    });
  }

  async remove(id: number): Promise<DeleteResponseDto> {
    await this.findOne(id);
    await this.prisma.area.delete({ where: { id } });
    return { success: true };
  }
}
