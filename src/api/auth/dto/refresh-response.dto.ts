import { ApiProperty } from '@nestjs/swagger';
import { AuthTokensDto } from './auth-tokens.dto';

export class RefreshResponseDto {
  @ApiProperty({ type: AuthTokensDto }) 
  tokens: AuthTokensDto;
}