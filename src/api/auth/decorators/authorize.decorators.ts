import { applyDecorators } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/enums/role.enum';

export const ROLES = 'roles';
export function Authorize(roles: Role[]) {
  return applyDecorators(
    SetMetadata(ROLES, roles),
    UseGuards(JwtGuard, RolesGuard),
  );
}
