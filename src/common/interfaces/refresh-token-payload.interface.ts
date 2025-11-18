import { Role } from '../enums';

export interface RefreshTokenPayload {
  sub: string;
  jti: string;
  role: Role;
  iat?: number;
  exp?: number;
}
