import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// import { AuthTokenRepository } from 'src/modules/user/repositories/auth-token.repository';
import { ExceptionFactory } from 'src/shared/factories/exception.factory';

import { ErrorCode } from '../../shared/constants/error-code';
import { ErrorMessage } from '../../shared/constants/error-message';
import { AUTH_STRATEGY } from '../constants/strategy.constant';
import { UserRefreshTokenClaims } from '../dtos/auth-token-output.dto';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  AUTH_STRATEGY.JWT_REFRESH,
) {
  constructor(
    private readonly configService: ConfigService,
  ) // private readonly authTokenRepository: AuthTokenRepository,
  {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: configService.get<string>('jwt.publicKey'),
      algorithms: ['RS256'],
      passReqToCallback: true,
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async validate(request: any, payload: any): Promise<UserRefreshTokenClaims> {
    const jwt = ExtractJwt.fromBodyField('refreshToken');
    const token = jwt(request);
    // const authToken = await this.authTokenRepository.findByRefreshToken(token);

    // if (!authToken) {
    //   throw ExceptionFactory.create(ErrorCode.AUTH_TOKEN_INVALID_REFRESH_TOKEN);
    // }

    // Passport automatically creates a user object, based on the value we return from the validate() method,
    // and assigns it to the Request object as req.user
    return { id: payload.sub };
  }
}
