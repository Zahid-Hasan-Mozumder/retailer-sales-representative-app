import { ApiProperty } from '@nestjs/swagger';

export class ImportRetailersResponseDto {
  @ApiProperty({ example: 2000000 })
  processed: number;

  @ApiProperty({ example: 1987654 })
  created: number;

  @ApiProperty({ example: 12345 })
  updated: number;

  @ApiProperty({ example: 1 })
  errors: number;
}