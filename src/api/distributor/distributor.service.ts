import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateDistributorDto,
  UpdateDistributorDto,
  DistributorResponseDto,
} from './dto';
import { DeleteResponseDto } from '../../common/dto';

@Injectable()
export class DistributorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDistributorDto): Promise<DistributorResponseDto> {
    return this.prisma.distributor.create({ data: { name: dto.name } });
  }

  async findAll(): Promise<DistributorResponseDto[]> {
    return this.prisma.distributor.findMany();
  }

  async findOne(id: number): Promise<DistributorResponseDto> {
    const distributor = await this.prisma.distributor.findUnique({
      where: { id },
    });
    if (!distributor) throw new NotFoundException('Distributor not found');
    return distributor;
  }

  async update(
    id: number,
    dto: UpdateDistributorDto,
  ): Promise<DistributorResponseDto> {
    await this.findOne(id);
    return this.prisma.distributor.update({
      where: { id },
      data: { ...(dto.name !== undefined ? { name: dto.name } : {}) },
    });
  }

  async remove(id: number): Promise<DeleteResponseDto> {
    await this.findOne(id);
    await this.prisma.distributor.delete({ where: { id } });
    return { success: true };
  }
}
