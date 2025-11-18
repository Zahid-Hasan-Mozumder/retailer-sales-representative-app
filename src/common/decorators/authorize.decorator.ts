import { applyDecorators } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { AccessTokenGuard, RolesGuard } from '../guards';
import { Role } from '../enums';

export const ROLES = 'roles';
export function Authorize(roles: Role[]) {
  return applyDecorators(
    SetMetadata(ROLES, roles),
    UseGuards(AccessTokenGuard, RolesGuard),
  );
}
