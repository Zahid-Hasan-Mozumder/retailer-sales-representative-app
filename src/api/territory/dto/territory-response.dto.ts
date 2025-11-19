import { ApiProperty } from '@nestjs/swagger';

export class TerritoryResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Sector 7' })
  name: string;

  @ApiProperty({ example: 1 })
  areaId: number;

  @ApiProperty({ example: new Date().toISOString() })
  createdAt: Date;

  @ApiProperty({ example: new Date().toISOString() })
  updatedAt: Date;
}
