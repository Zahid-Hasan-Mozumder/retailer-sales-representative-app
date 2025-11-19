import { ApiProperty } from '@nestjs/swagger';

export class ImportRetailersDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}