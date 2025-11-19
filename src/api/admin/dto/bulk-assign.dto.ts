import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayNotEmpty, IsInt, Min, IsString } from 'class-validator';

export class BulkAssignDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  salesRepId: number;

  @ApiProperty({ type: [String], example: ['uid-1', 'uid-2'] })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  retailerUids: string[];
}
