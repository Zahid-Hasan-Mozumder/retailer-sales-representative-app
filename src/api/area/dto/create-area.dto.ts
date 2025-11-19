import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min, MinLength } from 'class-validator';

export class CreateAreaDto {
  @ApiProperty({ example: 'Downtown' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  regionId: number;
}
