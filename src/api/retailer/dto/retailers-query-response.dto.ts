import { ApiProperty } from '@nestjs/swagger';
import { RetailerResponseDto } from './retailer-response.dto';

export class RetailersQueryResponseDto {
  @ApiProperty({ type: [RetailerResponseDto] })
  items: RetailerResponseDto[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 100 })
  total: number;

  constructor(
    items: RetailerResponseDto[],
    total: number,
    page: number,
    limit: number,
  ) {
    this.items = items;
    this.page = page;
    this.limit = limit;
    this.total = total;
  }
}
