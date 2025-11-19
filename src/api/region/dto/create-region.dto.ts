import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateRegionDto {
  @ApiProperty({ example: 'North' })
  @IsString()
  @MinLength(1)
  name: string;
}
