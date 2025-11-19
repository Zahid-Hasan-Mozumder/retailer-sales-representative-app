import { ApiProperty } from '@nestjs/swagger';

export class BulkAssignResponseDto {
  @ApiProperty({ example: 2 })
  assigned: number;

  @ApiProperty({ example: 4 })
  requested: number;
}
