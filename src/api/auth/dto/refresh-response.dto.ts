import { ApiProperty } from '@nestjs/swagger';
import { AuthTokensDto } from '../dto';

export class RefreshResponseDto {
  @ApiProperty({ type: AuthTokensDto })
  tokens: AuthTokensDto;
}
