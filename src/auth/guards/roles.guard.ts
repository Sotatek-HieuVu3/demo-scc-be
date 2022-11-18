import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ExceptionFactory } from 'src/shared/factories/exception.factory';

import { ErrorCode } from '../../shared/constants/error-code';
import { ROLE } from '../constants/role.constant';
import { ROLES_KEY } from '../decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<ROLE[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    if (requiredRoles.some((role) => user.roles?.includes(role))) {
      return true;
    }

    throw ExceptionFactory.create(ErrorCode.AUTH_ROLE_INVALID);
  }
}
