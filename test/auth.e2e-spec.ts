import { INestApplication } from '@nestjs/common';
import { matchers } from 'jest-json-schema';
import * as request from 'supertest';

import MigrationsManager from '../src/common/migration/migrations-manager';
import SeedsManager from '../src/common/seed/seeds-manager';

import { adminSchema } from './_tools/schemas';
import TestAppManager from './_tools/test-app-manager';

expect.extend(matchers);

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authorization: string;

  beforeAll(async () => {
    await MigrationsManager.run();
    await SeedsManager.run();
    app = await TestAppManager.init();
    authorization = await TestAppManager.getAuthorization();
  });

  describe('/api/auth/login (POST)', () => {
    test('{"body":{"username":"ns17","password":"123456"}} - 401 error, invalid username', async () => {
      const body = {
        username: 'ns17',
        password: '123456'
      };
      const res = await request(app.getHttpServer()).post('/api/auth/login').send(body);
      expect(res.status).toEqual(401);
      expect(res.body).toEqual({
        statusCode: 401,
        message: 'Invalid username or password',
        error: 'Unauthorized'
      });
    });

    test('{"body":{"username":"ns16","password":"123457"}} - 401 error, invalid password', async () => {
      const body = {
        username: 'ns16',
        password: '123457'
      };
      const res = await request(app.getHttpServer()).post('/api/auth/login').send(body);
      expect(res.status).toEqual(401);
      expect(res.body).toEqual({
        statusCode: 401,
        message: 'Invalid username or password',
        error: 'Unauthorized'
      });
    });

    test('{"body":{"username":"ns16","password":"123456"}} - success', async () => {
      const body = {
        username: 'ns16',
        password: '123456'
      };
      const res = await request(app.getHttpServer()).post('/api/auth/login').send(body);
      expect(res.status).toEqual(200);
      expect(res.body).toMatchSchema(adminSchema);
      expect(res.body).toMatchObject({
        id: 1,
        username: 'ns16'
      });
    });
  });

  describe('/api/auth/me (GET)', () => {
    test('401 error, invalid token', async () => {
      const res = await request(app.getHttpServer()).get('/api/auth/me');
      expect(res.status).toEqual(401);
      expect(res.body).toEqual({
        statusCode: 401,
        message: 'Invalid token',
        error: 'Unauthorized'
      });
    });

    test('success', async () => {
      const res = await request(app.getHttpServer()).get('/api/auth/me').set('Authorization', authorization);
      expect(res.status).toEqual(200);
      expect(res.body).toMatchSchema(adminSchema);
      expect(res.body).toMatchObject({
        id: 1,
        username: 'ns16'
      });
    });
  });

  afterAll(() => TestAppManager.close());
});
