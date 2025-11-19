import { ApiProperty } from '@nestjs/swagger';

export class BulkUnassignResponseDto {
  @ApiProperty({ example: 2 })
  unassigned: number;

  @ApiProperty({ example: 4 })
  requested: number;
}
