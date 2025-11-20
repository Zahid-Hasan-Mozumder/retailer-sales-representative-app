import { ApiProperty } from '@nestjs/swagger';

export class RetailerResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  uid: string;

  @ApiProperty({ example: 'Arif Ahmed' })
  name: string;

  @ApiProperty({ example: '+8801712345678' })
  phone: string;

  @ApiProperty({ example: 1 })
  regionId: number;

  @ApiProperty({ example: 1 })
  areaId: number;

  @ApiProperty({ example: 1 })
  distributorId: number;

  @ApiProperty({ example: 1 })
  territoryId: number;

  @ApiProperty({ example: { waypoints: [{ lat: 23.78, lng: 90.41 }] } })
  routes: any;

  @ApiProperty({ example: new Date().toISOString() })
  createdAt: Date;

  @ApiProperty({ example: new Date().toISOString() })
  updatedAt: Date;
}