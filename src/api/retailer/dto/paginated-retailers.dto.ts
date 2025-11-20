import { ApiProperty } from '@nestjs/swagger';
import { RetailerResponseDto } from './retailer-response.dto';

export class PaginatedRetailersResponseDto {
  @ApiProperty({ type: [RetailerResponseDto] })
  items: RetailerResponseDto[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 100 })
  total: number;
}