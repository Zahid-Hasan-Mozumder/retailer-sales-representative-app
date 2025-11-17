import { Role } from '../enums/role.enum';

export interface JwtPayload {
  sub: string;
  username: string;
  role: Role;
  iat?: number;
  exp?: number;
}
