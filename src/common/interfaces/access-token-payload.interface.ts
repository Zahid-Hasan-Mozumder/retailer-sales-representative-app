import { Role } from '../enums';

export interface AccessTokenPayload {
  sub: string;
  username: string;
  role: Role;
  iat?: number;
  exp?: number;
}
