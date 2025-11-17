import { ApiProperty } from '@nestjs/swagger';
import { AuthTokensDto } from './auth-tokens.dto';

export class SigninResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'admin_john' })
  username: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: '+1234567890' })
  phone: string;

  @ApiProperty({ type: AuthTokensDto })
  tokens: AuthTokensDto;
}
