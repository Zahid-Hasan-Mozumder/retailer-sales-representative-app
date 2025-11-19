import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as fs from 'fs';
import * as readline from 'readline';
import {
  BulkAssignDto,
  BulkAssignResponseDto,
  BulkUnassignDto,
  BulkUnassignResponseDto,
} from './dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async importRetailersFromCsv(filePath: string) {
    const stats = { processed: 0, created: 0, updated: 0, errors: 0 };
    const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
    let isHeader = true;
    for await (const line of rl) {
      if (isHeader) {
        isHeader = false;
        continue;
      }
      const row = this.parseCsvLine(line);
      if (!row || row.length < 8) {
        stats.errors++;
        continue;
      }
      const [
        uid,
        name,
        phone,
        regionName,
        areaName,
        distributorName,
        territoryName,
        routesStr,
      ] = row;
      try {
        const region = await this.upsertRegion(regionName);
        const area = await this.upsertArea(areaName, region.id);
        const distributor = await this.upsertDistributor(distributorName);
        const territory = await this.upsertTerritory(territoryName, area.id);
        const routes = this.safeJsonParse(routesStr) ?? { waypoints: [] };
        const existing = await this.prisma.retailer.findUnique({
          where: { uid: uid },
        });
        if (!existing) {
          await this.prisma.retailer.create({
            data: {
              uid: uid,
              name: name,
              phone: phone,
              regionId: region.id,
              areaId: area.id,
              distributorId: distributor.id,
              territoryId: territory.id,
              routes: routes,
            },
          });
          stats.created++;
        } else {
          await this.prisma.retailer.update({
            where: { uid },
            data: {
              name: name,
              phone: phone,
              regionId: region.id,
              areaId: area.id,
              distributorId: distributor.id,
              territoryId: territory.id,
              routes: routes,
            },
          });
          stats.updated++;
        }
      } catch {
        stats.errors++;
      } finally {
        stats.processed++;
      }
    }
    return stats;
  }

  async bulkAssignRetailers(
    dto: BulkAssignDto,
  ): Promise<BulkAssignResponseDto> {
    const salesRep = await this.prisma.salesRep.findUnique({
      where: { id: dto.salesRepId },
    });
    if (!salesRep) throw new Error('Sales representative not found');
    let assigned = 0;
    for (const uid of dto.retailerUids) {
      const retailer = await this.prisma.retailer.findUnique({
        where: { uid: uid },
      });
      if (!retailer) continue;
      await this.prisma.salesRepRetailer.upsert({
        where: {
          salesRepId_retailerId: {
            salesRepId: dto.salesRepId,
            retailerId: retailer.id,
          },
        },
        update: {},
        create: {
          salesRepId: dto.salesRepId,
          retailerId: retailer.id,
          assignedAt: new Date(Date.now()),
        },
      });
      assigned++;
    }
    return { assigned: assigned, requested: dto.retailerUids.length };
  }

  async bulkUnassignRetailers(
    dto: BulkUnassignDto,
  ): Promise<BulkUnassignResponseDto> {
    let unassigned = 0;
    for (const uid of dto.retailerUids) {
      const retailer = await this.prisma.retailer.findUnique({
        where: { uid: uid },
      });
      if (!retailer) continue;
      const exist = await this.prisma.salesRepRetailer.findUnique({
        where: {
          salesRepId_retailerId: {
            salesRepId: dto.salesRepId,
            retailerId: retailer.id,
          },
        },
      });
      if (!exist) continue;
      await this.prisma.salesRepRetailer.delete({
        where: {
          salesRepId_retailerId: {
            salesRepId: dto.salesRepId,
            retailerId: retailer.id,
          },
        },
      });
      unassigned++;
    }
    return { unassigned: unassigned, requested: dto.retailerUids.length };
  }

  private async upsertRegion(name: string) {
    const region = await this.prisma.region.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    return region;
  }

  private async upsertArea(name: string, regionId: number) {
    const area = await this.prisma.area.upsert({
      where: { name_regionId: { name, regionId } },
      update: {},
      create: { name, regionId },
    });
    return area;
  }

  private async upsertDistributor(name: string) {
    const distributor = await this.prisma.distributor.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    return distributor;
  }

  private async upsertTerritory(name: string, areaId: number) {
    const territory = await this.prisma.territory.upsert({
      where: { name_areaId: { name, areaId } },
      update: {},
      create: { name, areaId },
    });
    return territory;
  }

  private safeJsonParse(input: string) {
    try {
      return JSON.parse(input);
    } catch {
      return undefined;
    }
  }

  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (inQuotes) {
        if (char === '"') {
          if (line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          current += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ',') {
          result.push(current);
          current = '';
        } else {
          current += char;
        }
      }
    }
    result.push(current);
    return result;
  }
}
