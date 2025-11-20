import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MinLength,
  IsObject,
  IsNumber,
  IsInt,
} from 'class-validator';

export class UpdateRetailerDto {
  @ApiPropertyOptional({ example: 'Rahim Hossain' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @ApiPropertyOptional({ example: '+8801812345678' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  phone?: string;

  @ApiPropertyOptional({ example: 6 })
  @IsOptional()
  @IsNumber()
  @IsInt()
  regionId?: number;

  @ApiPropertyOptional({ example: 22 })
  @IsOptional()
  @IsNumber()
  @IsInt()
  areaId?: number;

  @ApiPropertyOptional({ example: 25 })
  @IsOptional()
  @IsNumber()
  @IsInt()
  distributorId?: number;

  @ApiPropertyOptional({ example: 66 })
  @IsOptional()
  @IsNumber()
  @IsInt()
  territoryId?: number;

  @ApiPropertyOptional({ example: { waypoints: [{ lat: 23.78, lng: 90.41 }] } })
  @IsOptional()
  @IsObject()
  routes?: any;
}
