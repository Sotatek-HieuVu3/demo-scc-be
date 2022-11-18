import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AUTH_STRATEGY } from '../constants/strategy.constant';
import { UserAccessTokenClaims } from '../dtos/auth-token-output.dto';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(
  Strategy,
  AUTH_STRATEGY.JWT_AUTH,
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('jwt.publicKey'),
      algorithms: ['RS256'],
      passReqToCallback: true,
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async validate(request: any, payload: any): Promise<UserAccessTokenClaims> {
    const jwt = ExtractJwt.fromAuthHeaderAsBearerToken();
    const token = jwt(request);
    // const authToken = await this.authTokenRepository.findByAccessToken(token);

    // if (!authToken) {
    //   throw ExceptionFactory.create(ErrorCode.AUTH_TOKEN_INVALID_ACCESS_TOKEN);
    // }

    // Passport automatically creates a user object, based on the value we return from the validate() method,
    // and assigns it to the Request object as req.user
    return {
      id: payload.sub,
      username: payload.username,
      roles: payload.roles,
    };
  }
}
