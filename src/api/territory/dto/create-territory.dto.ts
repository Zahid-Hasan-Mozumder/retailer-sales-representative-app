import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min, MinLength } from 'class-validator';

export class CreateTerritoryDto {
  @ApiProperty({ example: 'Sector 7' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  areaId: number;
}
