import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength, IsObject } from 'class-validator';

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

  @ApiPropertyOptional({ example: { waypoints: [{ lat: 23.78, lng: 90.41 }] } })
  @IsOptional()
  @IsObject()
  routes?: any;
}