import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SortOrder } from '../../../common/enums';

export class RetailersQueryFilter {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  regionId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  areaId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  distributorId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  territoryId?: number;
}

export class RetailersQuerySort {
  @ApiPropertyOptional({ required: false, enum: SortOrder })
  @IsOptional()
  @IsEnum(SortOrder)
  name?: SortOrder;

  @ApiPropertyOptional({ required: false, enum: SortOrder })
  @IsOptional()
  @IsEnum(SortOrder)
  updatedAt?: SortOrder;

  @ApiPropertyOptional({
    required: false,
    enum: SortOrder,
    default: SortOrder.DESC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  createdAt: SortOrder = SortOrder.DESC;
}

export class RetailersQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 20;

  @ApiPropertyOptional({ example: 'Arif' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ required: false, type: RetailersQueryFilter })
  @IsOptional()
  @ValidateNested()
  @Type(() => RetailersQueryFilter)
  filter: RetailersQueryFilter = new RetailersQueryFilter();

  @ApiPropertyOptional({ required: false, type: RetailersQuerySort })
  @IsOptional()
  @ValidateNested()
  @Type(() => RetailersQuerySort)
  sort: RetailersQuerySort = new RetailersQuerySort();
}
