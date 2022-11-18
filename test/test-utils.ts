import { HttpStatus, INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import { createConnection, getConnection } from 'typeorm';

import { ROLE } from '../src/auth/constants/role.constant';
import { LoginInput } from '../src/auth/dtos/auth-login-input.dto';
import { AuthTokenOutput } from '../src/auth/dtos/auth-token-output.dto';
import { CreateUserInput } from '../src/modules/user/dtos/user-create-input.dto';
import { UserOutput } from '../src/modules/user/dtos/user-output.dto';
import { UserService } from '../src/modules/user/services/user.service';
import { RequestContext } from '../src/shared/request-context/request-context.dto';

const TEST_DB_CONNECTION_NAME = 'e2e_test_connection';
export const TEST_DB_NAME = 'e2e_test_db';

export const resetDBBeforeTest = async (): Promise<void> => {
  // This overwrites the DB_NAME used in the SharedModule's TypeORM init.
  // All the tests will run against the e2e db due to this overwrite.
  process.env.DB_NAME = process.env.DB_NAME_TEST;
  process.env.DB_PORT = process.env.DB_PORT_TEST;
  process.env.DB_HOST = process.env.DB_HOST_TEST;

  console.log(
    `Dropping ${process.env.DB_NAME_TEST} database and recreating it`,
  );

  const connection = await createConnection({
    name: TEST_DB_CONNECTION_NAME,
    type: 'mysql',
    host: process.env.DB_HOST_TEST,
    port: parseInt(process.env.DB_PORT_TEST, 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
  });

  await connection.query(`drop database if exists ${process.env.DB_NAME_TEST}`);
  await connection.query(`create database ${process.env.DB_NAME_TEST}`);

  await connection.close();
};

export const createDBEntities = async (): Promise<void> => {
  console.log(`Creating entities in ${process.env.DB_NAME_TEST} database`);
  await createConnection({
    name: TEST_DB_CONNECTION_NAME,
    type: 'mysql',
    host: process.env.DB_HOST_TEST,
    port: parseInt(process.env.DB_PORT_TEST, 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME_TEST,
    entities: [__dirname + '/../src/modules/**/*.entity{.ts,.js}'],
    synchronize: true,
  });
};

export const requestUtil = (app: INestApplication) =>
  async function myRequest(
    url: string,
    {
      expectedStatus = HttpStatus.OK,
      method = 'get',
      body,
      contentType = 'application/json',
      accept = 'application/json',
      query,
      accessToken = 'mock-token',
      responseType,
    }: {
      expectedStatus?: HttpStatus;
      method?: 'get' | 'post' | 'put' | 'delete';
      body?: any;
      contentType?: string;
      accept?: string;
      query?: Record<string, any>;
      accessToken?: string;
      responseType?: string;
    } = {},
  ): Promise<any> {
    const agent = supertest.agent(app.getHttpServer());
    const req = agent[method](url)
      .set('Accept', accept)
      .set('x-api-key', process.env.API_KEY)
      .set('Authorization', `Bearer ${accessToken}`);

    responseType && req.responseType(responseType);
    query && req.query(query);

    const reqAfterSend = body
      ? req.set('Content-Type', contentType).send(body)
      : req;

    return reqAfterSend.expect(expectedStatus).then((res) => {
      try {
        return JSON.parse(res.text);
      } catch (error) {
        return res.text;
      }
    });
  };

export const seedAdminUser = async (
  app: INestApplication,
): Promise<{ adminUser: UserOutput; authTokenForAdmin: AuthTokenOutput }> => {
  const defaultAdmin: CreateUserInput = {
    name: 'Default Admin User',
    username: 'default-admin',
    password: 'default-admin-password',
    roles: [ROLE.ADMIN],
    isEnabled: false,
    email: 'default-admin@example.com',
    userSecurityId: 1,
  };

  const ctx = new RequestContext();

  // Creating Admin User
  const userService = app.get(UserService);
  const userOutput = await userService.createUser(ctx, defaultAdmin);

  const loginInput: LoginInput = {
    email: defaultAdmin.email,
    otpCode: 999999,
  };

  const request = requestUtil(app);

  // Logging in Admin User to get AuthToken
  const loginResponse = await request('/auth/login', {
    method: 'post',
    body: loginInput,
    expectedStatus: HttpStatus.CREATED,
  });

  const authTokenForAdmin: AuthTokenOutput = loginResponse.data;
  const adminUser: UserOutput = JSON.parse(JSON.stringify(userOutput));

  return { adminUser, authTokenForAdmin };
};

export const closeDBAfterTest = async (): Promise<void> => {
  console.log(`Closing connection to ${TEST_DB_NAME} database`);
  const connection = getConnection(TEST_DB_CONNECTION_NAME);
  await connection.close();
};
