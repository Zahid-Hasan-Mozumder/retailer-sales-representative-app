import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateDistributorDto {
  @ApiProperty({ example: 'ACME Distributors' })
  @IsString()
  @MinLength(1)
  name: string;
}
