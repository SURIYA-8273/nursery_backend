import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are required, allow access
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    
    // Check if user exists and has a required role
    const hasRole = user && requiredRoles.includes(user.role);
    
    if (!hasRole) {
      throw new UnauthorizedException('You do not have permission to perform this action');
    }

    return true;
  }
}
