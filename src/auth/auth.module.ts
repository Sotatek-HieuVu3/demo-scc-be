import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { QUEUE_NAME } from 'src/shared/constants';

import { UserModule } from '../modules/user/user.module';
import { SharedModule } from '../shared/shared.module';
import { AUTH_STRATEGY } from './constants/strategy.constant';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { HeaderApiKeyStrategy } from './strategies/header-api-key-auth.strategy';
import { JwtAuthStrategy } from './strategies/jwt-auth.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    SharedModule,
    PassportModule.register({ defaultStrategy: AUTH_STRATEGY.JWT_AUTH }),
    JwtModule.registerAsync({
      imports: [SharedModule],
      useFactory: async (configService: ConfigService) => ({
        publicKey: configService.get<string>('jwt.publicKey'),
        privateKey: configService.get<string>('jwt.privateKey'),
        signOptions: {
          algorithm: 'RS256',
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: QUEUE_NAME.DEFAULT,
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtAuthStrategy,
    JwtRefreshStrategy,
    HeaderApiKeyStrategy,
  ],
  // exports: [AuthService],
})
export class AuthModule {}
