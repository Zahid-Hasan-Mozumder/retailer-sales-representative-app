import { applyDecorators } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { RefreshTokenGuard, RolesGuard } from '../guards';
import { Role } from '../enums';

export const REFRESH_ROLES = 'roles';
export function Refresh(roles: Role[]) {
  return applyDecorators(
    SetMetadata(REFRESH_ROLES, roles),
    UseGuards(RefreshTokenGuard, RolesGuard),
  );
}
