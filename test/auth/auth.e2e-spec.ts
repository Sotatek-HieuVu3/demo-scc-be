import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { LoginInput } from '../../src/auth/dtos/auth-login-input.dto';
import { RefreshTokenInput } from '../../src/auth/dtos/auth-refresh-token-input.dto';
import { AuthTokenOutput } from '../../src/auth/dtos/auth-token-output.dto';
import { AppModule } from './../../src/app.module';
import {
  closeDBAfterTest,
  createDBEntities,
  requestUtil,
  resetDBBeforeTest,
  seedAdminUser,
} from './../test-utils';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authTokenForAdmin: AuthTokenOutput;
  let request: ReturnType<typeof requestUtil>;

  beforeAll(async () => {
    await resetDBBeforeTest();
    await createDBEntities();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    request = requestUtil(app);
    ({ authTokenForAdmin } = await seedAdminUser(app));
  });

  describe('Admin User Auth Tokens', () => {
    it('presence of Auth Tokens for admin ', async () => {
      expect(authTokenForAdmin).toHaveProperty('accessToken');
      expect(authTokenForAdmin).toHaveProperty('refreshToken');
    });
  });

  describe('login the registered user', () => {
    const loginInput: LoginInput = {
      email: 'default-admin@example.com',
      otpCode: 999999,
    };

    it('should successfully login the user', async () => {
      const response = await request('/auth/login', {
        method: 'post',
        body: loginInput,
        expectedStatus: HttpStatus.CREATED,
      });

      expect(response.data).toHaveProperty('accessToken');
      expect(response.data).toHaveProperty('refreshToken');
    });

    it('should failed to login with wrong credential', async () => {
      return request('/auth/login', {
        method: 'post',
        body: {
          ...loginInput,
          otpCode: 55555,
        },
        expectedStatus: HttpStatus.BAD_REQUEST,
      });
    });

    // TODO : Should fail when isEnabled is set to true.
  });

  describe('refreshing jwt token', () => {
    const loginInput: LoginInput = {
      email: 'default-admin@example.com',
      otpCode: 999999,
    };

    it('should successfully get new auth token using refresh token', async () => {
      const loginResponse = await request('/auth/login', {
        method: 'post',
        body: loginInput,
        expectedStatus: HttpStatus.CREATED,
      });

      const token: AuthTokenOutput = loginResponse.data;
      const refreshTokenInput: RefreshTokenInput = {
        refreshToken: token.refreshToken,
      };

      const refreshTokenResponse = await request('/auth/refresh-token', {
        method: 'post',
        body: refreshTokenInput,
        expectedStatus: HttpStatus.CREATED,
      });

      expect(refreshTokenResponse.data).toHaveProperty('accessToken');
      expect(refreshTokenResponse.data).toHaveProperty('refreshToken');
    });
  });

  afterAll(async () => {
    await app.close();
    await closeDBAfterTest();
  });

  // describe('register a new user', () => {
  //   const registerInput: RegisterInput = {
  //     name: 'e2etester',
  //     username: 'e2etester',
  //     password: '12345678',
  //     roles: [ROLE.USER],
  //     isEnabled: false,
  //     email: 'e2etester@random.com',
  //   };

  //   const registerOutput = {
  //     id: 2,
  //     name: 'e2etester',
  //     username: 'e2etester',
  //     roles: [ROLE.USER],
  //     isEnabled: false,
  //     email: 'e2etester@random.com',
  //   };

  //   it('successfully register a new user', () => {
  //     const response = await request;

  //     return request(app.getHttpServer())
  //       .post('/auth/register')
  //       .send(registerInput)
  //       .expect(HttpStatus.CREATED)
  //       .expect((res) => {
  //         const resp = res.body;
  //         expect(resp.data).toEqual(expect.objectContaining(registerOutput));
  //       });
  //   });

  //   it('register fails without Input DTO', () => {
  //     return request(app.getHttpServer())
  //       .post('/auth/register')
  //       .expect(HttpStatus.BAD_REQUEST);
  //   });

  //   it('register fails when incorrect username format', () => {
  //     registerInput.username = 12345 as any;
  //     return request(app.getHttpServer())
  //       .post('/auth/register')
  //       .expect(HttpStatus.BAD_REQUEST)
  //       .send(registerInput)
  //       .expect((res) => {
  //         const resp = res.body;
  //         expect(resp.error.details.message).toContain(
  //           'username must be a string',
  //         );
  //       });
  //   });
  // });
});
