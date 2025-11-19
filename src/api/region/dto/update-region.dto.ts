import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateRegionDto {
  @ApiPropertyOptional({ example: 'North-East' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;
}
