import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayNotEmpty, IsString, Min, IsInt } from 'class-validator';

export class BulkUnassignDto {
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
