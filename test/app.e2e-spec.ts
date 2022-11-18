import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from './../src/app.module';
import {
  closeDBAfterTest,
  createDBEntities,
  requestUtil,
  resetDBBeforeTest,
} from './test-utils';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let request: ReturnType<typeof requestUtil>;

  beforeAll(async () => {
    await resetDBBeforeTest();
    await createDBEntities();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
    request = requestUtil(app);
  });

  it('/ (GET)', async () => {
    const response = await request('/', {
      expectedStatus: HttpStatus.OK,
    });

    expect(response).toBe('Hello World!');
  });

  afterAll(async () => {
    await app.close();
    await closeDBAfterTest();
  });
});
