import { BullModule, getQueueToken } from '@nestjs/bull';
import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { CacheService } from 'src/cache/cache.service';
import { UserOutput } from 'src/modules/user/dtos/user-output.dto';
import { User } from 'src/modules/user/entities/user.entity';
import { ExceptionFactory } from 'src/shared/factories/exception.factory';

import { defaultTokenData } from '../../consoles/data/default-token.data';
import { Network } from '../../modules/network/entities/network.entity';
import { DefaultTokenRepository } from '../../modules/network/repositories/default-token.repository';
import { NetworkRepository } from '../../modules/network/repositories/network.repository';
import {
  E2FaType,
  EVerificationStatus,
} from '../../modules/user/constant/user-security.constant';
import { UserSecurity } from '../../modules/user/entities/use-security.entity';
import { UserBalance } from '../../modules/user/entities/user-balance.entity';
import { AuthTokenRepository } from '../../modules/user/repositories/auth-token.repository';
import { UserRepository } from '../../modules/user/repositories/user.repository';
import { UserBalanceRepository } from '../../modules/user/repositories/user-balance.repository';
import { UserSecurityRepository } from '../../modules/user/repositories/user-security.repository';
import { UserSettingRepository } from '../../modules/user/repositories/user-setting.repository';
import { UserService } from '../../modules/user/services/user.service';
import { DEFAULT_TOKEN_DECIMAL, QUEUE_NAME } from '../../shared/constants';
import { ErrorCode } from '../../shared/constants/error-code';
import { ErrorMessage } from '../../shared/constants/error-message';
import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { OtpService } from '../../shared/services/otp.service';
import { ROLE } from '../constants/role.constant';
import {
  AuthTokenOutput,
  UserAccessTokenClaims,
} from '../dtos/auth-token-output.dto';
import { AuthService } from './auth.service';

jest.mock('typeorm-transactional-cls-hooked', () => ({
  Transactional: () => () => ({}),
  BaseRepository: class {},
  runOnTransactionCommit: () => () => ({}),
}));

describe('AuthService', () => {
  let service: AuthService;

  const registerInput = {
    id: 1,
    username: 'jhon',
    name: 'Jhon doe',
    password: 'any password',
    roles: [ROLE.USER],
    isEnabled: false,
    email: 'randomUser@random.com',
  };

  const userInfoFromOtp = {
    id: 1,
    username: 'test',
    roles: ROLE.USER,
    userSecurityId: 1,
  };

  const accessTokenClaims: UserAccessTokenClaims = {
    id: userInfoFromOtp.id,
    username: userInfoFromOtp.username,
    roles: userInfoFromOtp.roles,
  };

  const userOutput: UserOutput = {
    username: 'jhon',
    name: 'Jhon doe',
    isEnabled: true,
    email: 'randomUser@random.com',
    bio: '',
    walletAddress: '',
    ...accessTokenClaims,
    defaultNetworkId: 1,
  };

  const authToken: AuthTokenOutput = {
    accessToken: 'random_access_token',
    refreshToken: 'random_refresh_token',
  };

  const loginCreditentials = {
    otpCode: 123456,
    email: 'test@gmail.com',
  };

  const networkOutput: Network = {
    id: 1,
    name: 'testnet',
    chainId: 1,
    rpcEndpoint: 'http://localhost:8545',
    explorerEndpoint: 'http://localhost:8545',
    blockTime: '1',
    chainName: 'testnet',
    nativeTokenSymbol: 'nativeTokenSymbol',
    nativeTokenDecimal: DEFAULT_TOKEN_DECIMAL,
    blockConfirmation: 1,
    isEnabled: true,
    treasuryAddress: '0x0',
    nftControllerAddress: '0x0',
    subgraphTreasuryUrl: 'https://subgraph.rinkeby.io/rinkeby/treasury',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockedUserService = {
    findById: jest.fn(),
    createUser: jest.fn(),
    validateUsernamePassword: jest.fn(),
  };

  const mockedJwtService = {
    sign: jest.fn(),
  };

  const mockedConfigService = { get: jest.fn() };

  const mockedLogger = { setContext: jest.fn(), log: jest.fn() };

  const mockedOtpService = {
    verifyOtp: jest.fn(),
  };
  const mockedUserRepository = {
    findUserInfoById: jest.fn(),
    findByColumn: jest.fn(),
    save: jest.fn(),
  };
  const mockedNetworkRepository = {
    findFirstNetwork: jest.fn(),
  };
  const mockedAuthTokenRepository = {
    findByColumn: jest.fn(),
    save: jest.fn(),
  };
  const mockedUserBalanceRepository = {
    save: jest.fn(),
  };
  const mockedUserSettingRepository = {
    save: jest.fn(),
  };
  const mockedDefaultTokenRepository = {
    find: jest.fn(),
  };
  const mockedUserSecurityRepository = {
    save: jest.fn(),
    updateUserSecurityEmailOtp: jest.fn(),
  };
  const importQueue: any = {
    add: jest.fn(),
    process: jest.fn(),
  };
  const mockedCacheService = {
    getCachedOrFetch: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        BullModule.registerQueue({
          name: QUEUE_NAME.DEFAULT,
        }),
      ],
      providers: [
        AuthService,
        { provide: UserService, useValue: mockedUserService },
        { provide: OtpService, useValue: mockedOtpService },
        { provide: JwtService, useValue: mockedJwtService },
        { provide: ConfigService, useValue: mockedConfigService },
        { provide: AppLogger, useValue: mockedLogger },
        { provide: UserRepository, useValue: mockedUserRepository },
        {
          provide: UserSettingRepository,
          useValue: mockedUserSettingRepository,
        },
        {
          provide: DefaultTokenRepository,
          useValue: mockedDefaultTokenRepository,
        },
        {
          provide: UserSecurityRepository,
          useValue: mockedUserSecurityRepository,
        },
        {
          provide: UserBalanceRepository,
          useValue: mockedUserBalanceRepository,
        },
        { provide: NetworkRepository, useValue: mockedNetworkRepository },
        { provide: AuthTokenRepository, useValue: mockedAuthTokenRepository },
        {
          provide: CacheService,
          useValue: mockedCacheService,
        },
      ],
    })
      .overrideProvider(getQueueToken(QUEUE_NAME.DEFAULT))
      .useValue(importQueue)
      .compile();

    service = moduleRef.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const ctx = new RequestContext();
  ctx.user = accessTokenClaims;

  describe('validateUser', () => {
    it('should success when username/password valid', async () => {
      jest
        .spyOn(mockedUserService, 'validateUsernamePassword')
        .mockImplementation(() => userOutput);

      expect(await service.validateUser(ctx, 'jhon', 'somepass')).toEqual(
        userOutput,
      );
      expect(mockedUserService.validateUsernamePassword).toBeCalledWith(
        ctx,
        'jhon',
        'somepass',
      );
    });

    it('should fail when username/password invalid', async () => {
      jest
        .spyOn(mockedUserService, 'validateUsernamePassword')
        .mockImplementation(() => {
          throw new UnauthorizedException();
        });

      await expect(
        service.validateUser(ctx, 'jhon', 'somepass'),
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('should fail when user account is disabled', async () => {
      jest
        .spyOn(mockedUserService, 'validateUsernamePassword')
        .mockImplementation(() => ({ ...userOutput, isEnabled: false }));

      await expect(
        service.validateUser(ctx, 'jhon', 'somepass'),
      ).rejects.toThrowError(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should get user info from verify otp function', async () => {
      jest
        .spyOn(service, 'getAuthToken')
        .mockImplementation(async () => authToken);

      jest.spyOn(mockedOtpService, 'verifyOtp').mockImplementation(() => {
        return Promise.resolve(userInfoFromOtp);
      });
      await service.login(ctx, loginCreditentials);

      expect(mockedOtpService.verifyOtp).toBeCalledWith(
        loginCreditentials.otpCode,
        loginCreditentials.email,
      );
      await expect(
        mockedOtpService.verifyOtp(
          loginCreditentials.otpCode,
          loginCreditentials.email,
        ),
      ).resolves.toEqual(userInfoFromOtp);
    });

    it('should return auth token for valid user', async () => {
      jest
        .spyOn(service, 'getAuthToken')
        .mockImplementation(async () => authToken);

      jest.spyOn(mockedOtpService, 'verifyOtp').mockImplementation(() => {
        return Promise.resolve(userInfoFromOtp);
      });

      const result = await service.login(ctx, loginCreditentials);

      expect(service.getAuthToken).toBeCalledWith(ctx, userInfoFromOtp);
      expect(result).toEqual(authToken);
    });

    it('should throw invalid email when login using wrong email in development environment', async function () {
      jest.spyOn(mockedConfigService, 'get').mockImplementation((params) => {
        if (params === 'isDev') return true;
        if (params === 'otp.test') return loginCreditentials.otpCode;

        return null;
      });
      jest
        .spyOn(mockedUserRepository, 'findByColumn')
        .mockImplementation(async () => Promise.resolve(null));

      await expect(service.login(ctx, loginCreditentials)).rejects.toThrowError(
        ExceptionFactory.create(ErrorCode.AUTH_INVALID_EMAIL),
      );

      expect(mockedUserRepository.findByColumn).toBeCalledWith(
        'email',
        loginCreditentials.email,
      );
    });

    it('should return auth token with test input in development environment', async function () {
      jest.spyOn(mockedConfigService, 'get').mockImplementation((params) => {
        if (params === 'isDev') return true;
        if (params === 'otp.test') return loginCreditentials.otpCode;

        return null;
      });
      jest
        .spyOn(service, 'getAuthToken')
        .mockImplementation(async () => authToken);
      jest
        .spyOn(mockedUserRepository, 'findByColumn')
        .mockImplementation(async () => Promise.resolve(userOutput));

      const result = await service.login(ctx, loginCreditentials);
      expect(service.getAuthToken).toBeCalledWith(ctx, userOutput);
      expect(result).toEqual(authToken);
    });
  });

  describe('register', function () {
    it('should create entities', async () => {
      jest
        .spyOn(mockedUserSecurityRepository, 'save')
        .mockImplementation(async () => {
          return Promise.resolve(
            plainToClass(UserSecurity, {
              id: 1,
              phoneNumberVerified: EVerificationStatus.UN_VERIFIED,
              type2Fa: E2FaType.NO_SETTING,
              otp: '',
            }),
          );
        });

      jest.spyOn(mockedUserRepository, 'save').mockImplementation(async () => {
        return Promise.resolve(registerInput);
      });
      jest
        .spyOn(mockedNetworkRepository, 'findFirstNetwork')
        .mockImplementation(async () => {
          return Promise.resolve(networkOutput);
        });
      jest
        .spyOn(mockedCacheService, 'getCachedOrFetch')
        .mockImplementation(async () => {
          return Promise.resolve(defaultTokenData);
        });
      jest
        .spyOn(mockedUserBalanceRepository, 'save')
        .mockImplementation(async (input) => {
          return Promise.resolve(input);
        });

      const res = await service.register(ctx, loginCreditentials.email);
      expect(mockedUserSecurityRepository.save).toBeCalledWith({
        phoneNumberVerified: EVerificationStatus.UN_VERIFIED,
        type2Fa: E2FaType.NO_SETTING,
      });
      expect(mockedUserRepository.save).toBeCalledWith(
        expect.objectContaining({
          username: expect.any(String),
        }),
      );
      expect(mockedNetworkRepository.findFirstNetwork).toBeCalled();
      expect(mockedCacheService.getCachedOrFetch).toBeCalled();
      expect(mockedUserBalanceRepository.save).toBeCalledWith(
        defaultTokenData.map((token) =>
          plainToClass(UserBalance, {
            userId: registerInput.id,
            defaultTokenId: token.id,
            balance: 0,
            availableBalance: 0,
            isEnabled: true,
          }),
        ),
      );
      expect(res).toEqual(registerInput);
    });
  });

  describe('refreshToken', function () {
    it('should throw error when user not found', function () {
      jest.spyOn(mockedUserService, 'findById').mockImplementation(async () => {
        return Promise.resolve(null);
      });

      expect(service.refreshToken(ctx)).rejects.toThrowError(
        ExceptionFactory.create(ErrorCode.USER_ID_NOT_FOUND),
      );
    });

    it('should return token', function () {
      jest
        .spyOn(service, 'getAuthToken')
        .mockImplementation(async () => authToken);
      jest.spyOn(mockedUserService, 'findById').mockImplementation(async () => {
        return Promise.resolve(registerInput);
      });

      expect(service.refreshToken(ctx)).resolves.toEqual(authToken);
    });
  });

  describe('updateUserAuthToken', function () {
    it('should create new auth token if auth token does not exist', async function () {
      const userId = 10;
      const newAuthTokenRecord = {
        userId,
        ...authToken,
      };

      jest
        .spyOn(mockedAuthTokenRepository, 'findByColumn')
        .mockImplementation(async () => Promise.resolve(null));
      jest
        .spyOn(mockedAuthTokenRepository, 'save')
        .mockImplementation(async () => Promise.resolve(authToken));

      await service.updateUserAuthToken(
        userId,
        authToken.refreshToken,
        authToken.accessToken,
      );

      expect(mockedAuthTokenRepository.save).toBeCalledWith(newAuthTokenRecord);
    });

    it('should update auth token if auth token record exists', async function () {
      const userId = 10;
      const existingAuthTokenRecord = {
        id: 1,
        userId,
        refreshToken: 'oldRefreshToken',
        accessToken: 'oldAccessToken',
        isDeleted: false,
      };

      jest
        .spyOn(mockedAuthTokenRepository, 'findByColumn')
        .mockImplementation(async () =>
          Promise.resolve(existingAuthTokenRecord),
        );
      jest
        .spyOn(mockedAuthTokenRepository, 'save')
        .mockImplementation(async () => Promise.resolve(authToken));

      await service.updateUserAuthToken(
        userId,
        authToken.refreshToken,
        authToken.accessToken,
      );

      expect(mockedAuthTokenRepository.save).toBeCalledWith({
        ...existingAuthTokenRecord,
        ...authToken,
      });
    });
  });

  describe('getAuthToken', () => {
    const accessTokenExpiry = 100;
    const refreshTokenExpiry = 200;
    const user = { id: 5, username: 'username', roles: ROLE.USER };

    const subject = { sub: user.id };
    const payload = {
      username: user.username,
      sub: user.id,
      roles: ROLE.USER,
    };

    beforeEach(() => {
      jest.spyOn(mockedConfigService, 'get').mockImplementation((key) => {
        let value = null;
        switch (key) {
          case 'jwt.accessTokenExpiresInSec':
            value = accessTokenExpiry;
            break;
          case 'jwt.refreshTokenExpiresInSec':
            value = refreshTokenExpiry;
            break;
        }
        return value;
      });

      jest
        .spyOn(mockedJwtService, 'sign')
        .mockImplementation(() => 'signed-response');
    });

    it('should generate access token with payload', async () => {
      const result = await service.getAuthToken(ctx, user);

      expect(mockedJwtService.sign).toBeCalledWith(
        { ...payload, ...subject },
        { expiresIn: accessTokenExpiry },
      );

      expect(result).toMatchObject({
        accessToken: 'signed-response',
      });
    });

    it('should generate refresh token with subject', async () => {
      const result = await service.getAuthToken(ctx, user);

      expect(mockedJwtService.sign).toBeCalledWith(subject, {
        expiresIn: refreshTokenExpiry,
      });

      expect(result).toMatchObject({
        refreshToken: 'signed-response',
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });

  describe('requestMailOtp', () => {
    beforeEach(() => {
      jest
        .spyOn(mockedUserRepository, 'findByColumn')
        .mockImplementation(async () => {
          return Promise.resolve(userOutput as unknown as User);
        });

      jest
        .spyOn(mockedUserSecurityRepository, 'updateUserSecurityEmailOtp')
        .mockImplementation(async ({}) => {
          return Promise.resolve(null);
        });

      jest.spyOn(service, 'register').mockImplementation(async () => {
        return Promise.resolve(userOutput as unknown as User);
      });
    });

    it('should call register if user is not found', async () => {
      jest
        .spyOn(mockedUserRepository, 'findByColumn')
        .mockImplementation(async () => {
          return Promise.resolve(null);
        });

      const result = await service.requestMailOtp(ctx, {
        email: loginCreditentials.email,
      });
      expect(mockedUserRepository.findByColumn).toBeCalled();
      expect(service.register).toBeCalledWith(ctx, loginCreditentials.email);
      expect(result).toBe(true);
    });

    it('should call register if user is not found', async () => {
      const result = await service.requestMailOtp(ctx, {
        email: loginCreditentials.email,
      });
      expect(mockedUserRepository.findByColumn).toBeCalled();
      expect(service.register).not.toBeCalled();
      expect(result).toBe(true);
    });
  });
});
