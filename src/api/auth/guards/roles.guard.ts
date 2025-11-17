import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES } from 'src/auth/decorators/authorize.decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get the roles required for this route
    const roles = this.reflector.get<string[]>(ROLES, context.getHandler());

    // If no roles are required, allow access
    if (!roles) {
      return true;
    }

    // Get the user from the request object (set by JwtGuard)
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check if user has the required roles
    if (user && user.role) {
      const hasRole = roles.some((role) => user.role.includes(role));
      if (!hasRole) {
        throw new ForbiddenException(
          'You do not have permission to access this resource',
        );
      }
      return hasRole;
    }

    return false;
  }
}
