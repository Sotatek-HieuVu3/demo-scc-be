import { Injectable } from '@nestjs/common';
import console from 'console';
// import {
//   AuthTokenOutput,
//   UserAccessTokenClaims,
// } from '../dtos/auth-token-output.dto';
import nacl from 'tweetnacl';
import pkg from 'tweetnacl-util';

import { UserService } from '../../modules/user/services/user.service';
// import { ConfigService } from '@nestjs/config';
// import { JwtService } from '@nestjs/jwt';
// import { Queue } from 'bull';
// import { plainToClass } from 'class-transformer';
// import { AuthToken } from 'src/modules/user/entities/auth-token.entity';
// import { User } from 'src/modules/user/entities/user.entity';
// import { AuthTokenRepository } from 'src/modules/user/repositories/auth-token.repository';
// import { QUEUE_NAME } from 'src/shared/constants';
// import { ExceptionFactory } from 'src/shared/factories/exception.factory';
// import { UserOutput } from '../../modules/user/dtos/user-output.dto';
// import { ErrorCode } from '../../shared/constants/error-code';
import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { LoginInput } from '../dtos/auth-login-input.dto';
const { decodeUTF8 } = pkg;
import * as anchor from '@project-serum/anchor';
import * as base64 from 'byte-base64';

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: AppLogger,
    private readonly userService: UserService, // private readonly configService: ConfigService, // private readonly jwtService: JwtService, // private readonly authTokenRepository: AuthTokenRepository,
  ) {
    this.logger.setContext(AuthService.name);
  }

  //   async validateUser(
  //     ctx: RequestContext,
  //     username: string,
  //     pass: string,
  //   ): Promise<any> {
  //     this.logger.log(ctx, `${this.validateUser.name} was called`);

  //     // The userService will throw Unauthorized in case of invalid username/password.
  //     const user = await this.userService.validateUsernamePassword(
  //       ctx,
  //       username,
  //       pass,
  //     );

  //     return user;
  //   }

  async login(ctx: RequestContext, loginInput: LoginInput): Promise<boolean> {
    this.logger.log(ctx, `${this.login.name} was called`);
    const user = await this.userService.findUserByEmail(loginInput.email);

    const message = 'The quick brown fox jumps over the lazy dog';
    const messageBytes = decodeUTF8(message);

    const verifyMessage = base64.base64ToBytes(loginInput.message);
    const userPubkey = new anchor.web3.PublicKey(user.walletAddress);

    console.log('========================');
    console.log(user);
    console.log('========================');
    let result;
    try {
      result = nacl.sign.detached.verify(
        messageBytes,
        verifyMessage,
        userPubkey.toBytes(),
      );
    } catch (error) {
      console.log('LOI ROI');
      result = false;
    }

    console.log(result);
    return result;
  }

  //   async refreshToken(ctx: RequestContext): Promise<AuthTokenOutput> {
  //     this.logger.log(ctx, `${this.refreshToken.name} was called`);

  //     const user = await this.userService.findById(ctx, ctx.user.id);
  //     if (!user) {
  //       throw ExceptionFactory.create(ErrorCode.USER_ID_NOT_FOUND);
  //     }

  //     return this.getAuthToken(ctx, user);
  //   }

  //   async updateUserAuthToken(
  //     userId: number,
  //     refreshToken: string,
  //     accessToken: string,
  //   ): Promise<void> {
  //     let authToken = await this.authTokenRepository.findByColumn(
  //       'userId',
  //       userId,
  //     );
  //     if (authToken) {
  //       authToken.accessToken = accessToken;
  //       authToken.refreshToken = refreshToken;
  //     } else {
  //       authToken = plainToClass(AuthToken, {
  //         userId,
  //         accessToken,
  //         refreshToken,
  //       });
  //     }

  //     await this.authTokenRepository.save(authToken);
  //   }

  //   async getAuthToken(
  //     ctx: RequestContext,
  //     user: UserAccessTokenClaims | UserOutput,
  //   ): Promise<AuthTokenOutput> {
  //     this.logger.log(ctx, `${this.getAuthToken.name} was called`);

  //     const subject = { sub: user.id };
  //     const payload = {
  //       username: user.username,
  //       sub: user.id,
  //       roles: user.roles,
  //     };

  //     const authToken = {
  //       refreshToken: this.jwtService.sign(subject, {
  //         expiresIn: this.configService.get('jwt.refreshTokenExpiresInSec'),
  //       }),
  //       accessToken: this.jwtService.sign(
  //         { ...payload, ...subject },
  //         { expiresIn: this.configService.get('jwt.accessTokenExpiresInSec') },
  //       ),
  //     };

  //     await this.updateUserAuthToken(
  //       user.id,
  //       authToken.refreshToken,
  //       authToken.accessToken,
  //     );

  //     return plainToClass(AuthTokenOutput, authToken, {
  //       excludeExtraneousValues: true,
  //     });
  //   }

  //   async validateToken(token: string): Promise<{
  //     success: boolean;
  //     user: Partial<User>;
  //   }> {
  //     const jwtPayload = this.jwtService.verify(token);
  //     const user = await this.userRepository.findByColumn('id', jwtPayload.sub);
  //     return {
  //       success: !!user,
  //       user,
  //     };
  //   }

  //   async logout(ctx: RequestContext): Promise<boolean> {
  //     this.logger.log(ctx, `${this.logout.name} was called`);
  //     await this.updateUserAuthToken(+ctx.user.id, '', '');

  //     return true;
  //   }
}
