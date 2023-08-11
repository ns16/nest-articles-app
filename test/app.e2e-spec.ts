import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import TestAppManager from './_tools/test-app-manager';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => (app = await TestAppManager.init()));

  test('/api (GET)', () => request(app.getHttpServer()).get('/api').expect(200).expect('Hello World!'));

  afterAll(() => TestAppManager.close());
});
