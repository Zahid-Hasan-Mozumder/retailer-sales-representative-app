import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES, REFRESH_ROLES } from '../decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get the roles required for this route
    const roles = this.reflector.get<string[]>(ROLES, context.getHandler());
    const refreshRoles = this.reflector.get<string[]>(
      REFRESH_ROLES,
      context.getHandler(),
    );

    console.log('roles', roles);
    console.log('refreshRoles', refreshRoles);
    
    // If no roles are required, allow access
    if (!roles && !refreshRoles) {
      return true;
    }

    // Get the user from the request object (set by JwtGuard)
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check if user has the required roles
    if (user && user.role) {
      const hasRole = roles.some((role) => user.role.includes(role));
      const hasRefreshRole = refreshRoles.some((role) =>
        user.role.includes(role),
      );

      if (roles && !hasRole) {
        throw new ForbiddenException(
          'You do not have permission to access this resource',
        );
      }

      if (refreshRoles && !hasRefreshRole) {
        throw new ForbiddenException(
          'You do not have permission to refresh this token',
        );
      }

      return (roles && hasRole) || (refreshRoles && hasRefreshRole);
    }

    return false;
  }
}
