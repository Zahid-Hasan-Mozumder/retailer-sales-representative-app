import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateDistributorDto {
  @ApiPropertyOptional({ example: 'ACME Distribution Ltd.' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;
}
