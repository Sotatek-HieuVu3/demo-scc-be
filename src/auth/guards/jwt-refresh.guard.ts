import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { ExceptionFactory } from 'src/shared/factories/exception.factory';

import { ErrorCode } from '../../shared/constants/error-code';
import { AUTH_STRATEGY } from '../constants/strategy.constant';

@Injectable()
export class JwtRefreshGuard extends AuthGuard(AUTH_STRATEGY.JWT_REFRESH) {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments

    if (err || !user) {
      throw ExceptionFactory.create(
        ErrorCode.AUTH_TOKEN_INVALID_REFRESH_TOKEN,
        info,
      );
    }
    return user;
  }
}
