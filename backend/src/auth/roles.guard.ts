import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthUser } from './auth-user.interface';
import { ROLES_KEY } from './roles.decorator';
import { Role } from '../users/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (!roles?.length) return true;
    return roles.includes(context.switchToHttp().getRequest<{ user: AuthUser }>().user.role);
  }
}
