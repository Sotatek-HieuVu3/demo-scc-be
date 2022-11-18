import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../../src/app.module';
import { AuthTokenOutput } from '../../src/auth/dtos/auth-token-output.dto';
import { UserOutput } from '../../src/modules/user/dtos/user-output.dto';
import {
  closeDBAfterTest,
  createDBEntities,
  requestUtil,
  resetDBBeforeTest,
  seedAdminUser,
} from '../test-utils';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let adminUser: UserOutput;
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

    ({ adminUser, authTokenForAdmin } = await seedAdminUser(app));
  });

  describe('Get user me', () => {
    it('gets user me', async () => {
      return request('/users/me', {
        accessToken: authTokenForAdmin.accessToken,
        expectedStatus: HttpStatus.OK,
      });
    });

    it('Unauthorized error when BearerToken is not provided', async () => {
      return request('/users/me', {
        expectedStatus: HttpStatus.UNAUTHORIZED,
      });
    });

    it('Unauthorized error when BearerToken is wrong', async () => {
      return request('/users/me', {
        accessToken: 'abcd',
        expectedStatus: HttpStatus.UNAUTHORIZED,
      });
    });
  });

  describe('get all users', () => {
    it('returns all users', async () => {
      const expectedOutput = [adminUser];

      const response = await request('/users', {
        accessToken: authTokenForAdmin.accessToken,
        expectedStatus: HttpStatus.OK,
      });
      expect(response).toEqual({
        data: expectedOutput,
        meta: { count: 1 },
      });
    });
  });

  // const updateUserInput = {
  //   name: 'New e2etestername',
  //   password: '12345678aA12',
  // };

  // describe('update a user', () => {
  //   it('successfully updates a user', async () => {
  //     const expectedOutput: UserOutput = {
  //       ...adminUser,
  //       ...{ name: 'New e2etestername' },
  //     };

  //     return request(app.getHttpServer())
  //       .patch('/users/1')
  //       .send(updateUserInput)
  //       .expect(HttpStatus.OK)
  //       .expect((res) => {
  //         const resp = res.body;
  //         expect(resp).toEqual({ data: expectedOutput, meta: {} });
  //       });
  //   });

  //   it('throws NOT_FOUND when user doesnt exist', () => {
  //     return request(app.getHttpServer())
  //       .patch('/users/99')
  //       .expect(HttpStatus.NOT_FOUND);
  //   });

  //   it('update fails when incorrect password type', () => {
  //     updateUserInput.password = 12345 as any;
  //     return request(app.getHttpServer())
  //       .patch('/users/1')
  //       .expect(HttpStatus.BAD_REQUEST)
  //       .send(updateUserInput)
  //       .expect((res) => {
  //         const resp = res.body;

  //         expect(resp.error.details.message).toContain(
  //           'password must be a string',
  //         );
  //       });
  //   });
  // });

  afterAll(async () => {
    await app.close();
    await closeDBAfterTest();
  });
});
