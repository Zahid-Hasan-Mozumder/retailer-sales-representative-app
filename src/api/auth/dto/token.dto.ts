import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TokenDto {
  @ApiProperty({
    description: 'Refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsNotEmpty({ message: 'Refresh token should not be empty' })
  @IsString({ message: 'Refresh token should be a string' })
  refreshToken: string;
}