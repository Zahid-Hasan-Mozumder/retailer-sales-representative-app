import { ApiProperty } from '@nestjs/swagger';

export class AreaResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Downtown' })
  name: string;

  @ApiProperty({ example: 1 })
  regionId: number;

  @ApiProperty({ example: new Date().toISOString() })
  createdAt: Date;

  @ApiProperty({ example: new Date().toISOString() })
  updatedAt: Date;
}
