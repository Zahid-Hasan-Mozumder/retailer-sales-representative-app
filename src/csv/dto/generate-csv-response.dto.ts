import { ApiProperty } from '@nestjs/swagger';

export class GenerateCsvResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'D:/ManushTech/retailer-sales-representative-app/storage/csv/retailers_2000000_1732050800.csv' })
  path: string;
}