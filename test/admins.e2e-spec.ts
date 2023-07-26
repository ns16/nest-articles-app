import { INestApplication } from '@nestjs/common';
import { matchers } from 'jest-json-schema';
import * as request from 'supertest';
import MigrationsManager from '../src/common/migration/migrations-manager';
import SeedsManager from '../src/common/seed/seeds-manager';
import { adminSchema, adminsListSchema, paginationSchema } from './_tools/schemas';
import TestAppManager from './_tools/test-app-manager';

expect.extend(matchers);

describe('AdminsController (e2e)', () => {

  let app: INestApplication;
  let authorization: string;

  beforeAll(async () => {
    await MigrationsManager.run();
    await SeedsManager.run();
    app = await TestAppManager.init();
    authorization = await TestAppManager.getAuthorization();
  });

  describe('/api/admins (GET)', () => {
    test('{"query":{}} - 401 error, invalid token', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/admins')
        .query({});
      expect(res.status).toEqual(401);
      expect(res.body).toEqual({
        statusCode: 401,
        message: 'Invalid token',
        error: 'Unauthorized'
      });
    });

    test('{"query":{"foo":"bar"}} - 400 error, invalid query parameter', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/admins')
        .query({ foo: 'bar' })
        .set('Authorization', authorization);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        statusCode: 400,
        message: [
          'property foo should not exist'
        ],
        error: 'Bad Request'
      });
    });

    test('{"query":{}} - success', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/admins')
        .query({})
        .set('Authorization', authorization);
      expect(res.status).toEqual(200);
      expect(res.body.data).toMatchSchema(adminsListSchema);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.pagination).toMatchSchema(paginationSchema);
      expect(res.body.pagination).toMatchObject({
        page: 1,
        pageSize: 10,
        rowCount: 1,
        pageCount: 1
      });
    });

    describe('paging', () => {
      test('{"query":{"page":1}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/admins')
          .query({ page: 1 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(adminsListSchema);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 1,
          pageCount: 1
        });
      });

      test('{"query":{"page":2}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/admins')
          .query({ page: 2 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(adminsListSchema);
        expect(res.body.data).toHaveLength(0);
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 2,
          pageSize: 10,
          rowCount: 1,
          pageCount: 1
        });
      });
    });
  });

  describe('/api/admins/all (GET)', () => {
    test('{"query":{}} - 401 error, invalid token', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/admins/all')
        .query({});
      expect(res.status).toEqual(401);
      expect(res.body).toEqual({
        statusCode: 401,
        message: 'Invalid token',
        error: 'Unauthorized'
      });
    });

    test('{"query":{"foo":"bar"}} - 400 error, invalid query parameter', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/admins/all')
        .query({ foo: 'bar' })
        .set('Authorization', authorization);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        statusCode: 400,
        message: [
          'property foo should not exist'
        ],
        error: 'Bad Request'
      });
    });

    test('{"query":{}} - success', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/admins/all')
        .query({})
        .set('Authorization', authorization);
      expect(res.status).toEqual(200);
      expect(res.body).toMatchSchema(adminsListSchema);
      expect(res.body).toHaveLength(1);
    });
  });

  describe('/api/admins/:id (GET)', () => {
    test('{"params":{"id":1},"query":{}} - 401 error, invalid token', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/admins/1')
        .query({});
      expect(res.status).toEqual(401);
      expect(res.body).toEqual({
        statusCode: 401,
        message: 'Invalid token',
        error: 'Unauthorized'
      });
    });

    test('{"params":{"id":"a"},"query":{}} - 400 error, id param must be a number', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/admins/a')
        .query({})
        .set('Authorization', authorization);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
        error: 'Bad Request'
      });
    });

    test('{"params":{"id":100},"query":{}} - 404 error, entity not found', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/admins/100')
        .query({})
        .set('Authorization', authorization);
      expect(res.status).toEqual(404);
      expect(res.body).toEqual({
        statusCode: 404,
        message: 'Not Found'
      });
    });

    test('{"params":{"id":1},"query":{"foo":"bar"}} - 400 error, invalid query parameter', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/admins/1')
        .query({ foo: 'bar' })
        .set('Authorization', authorization);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        statusCode: 400,
        message: [
          'property foo should not exist'
        ],
        error: 'Bad Request'
      });
    });

    test('{"params":{"id":1},"query":{}} - success', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/admins/1')
        .query({})
        .set('Authorization', authorization);
      expect(res.status).toEqual(200);
      expect(res.body).toMatchSchema(adminSchema);
      expect(res.body).toHaveProperty('id', 1);
    });
  });

  describe('/api/admins (POST)', () => {
    test('{"body":{"name":"Anatoly Muravyov","username":"test","password":"RDnB7LAR","email":"anatoly.muravyov@gmail.com"}} - 401 error, invalid token', async () => {
      const body = {
        name: 'Anatoly Muravyov',
        username: 'test',
        password: 'RDnB7LAR',
        email: 'anatoly.muravyov@gmail.com'
      };
      const res = await request(app.getHttpServer())
        .post('/api/admins')
        .send(body);
      expect(res.status).toEqual(401);
      expect(res.body).toEqual({
        statusCode: 401,
        message: 'Invalid token',
        error: 'Unauthorized'
      });
    });

    test('{"body":{"name":"Anatoly Muravyov","username":"ns16","password":"RDnB7LAR","email":"anatoly.muravyov@gmail.com"}} - 400 error, username field must be unique', async () => {
      const body = {
        name: 'Anatoly Muravyov',
        username: 'ns16',
        password: 'RDnB7LAR',
        email: 'anatoly.muravyov@gmail.com'
      };
      const res = await request(app.getHttpServer())
        .post('/api/admins')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        statusCode: 400,
        message: [
          'username field must be unique'
        ],
        error: 'Bad Request'
      });
    });

    test('{"body":{"name":"Anatoly Muravyov","username":"test","password":"RDnB7LAR","email":"anatoly.muravyov+gmail.com"}} - 400 error, email must be an email', async () => {
      const body = {
        name: 'Anatoly Muravyov',
        username: 'test',
        password: 'RDnB7LAR',
        email: 'anatoly.muravyov+gmail.com'
      };
      const res = await request(app.getHttpServer())
        .post('/api/admins')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        statusCode: 400,
        message: [
          'email must be an email'
        ],
        error: 'Bad Request'
      });
    });

    test('{"body":{"name":"Anatoly Muravyov","username":"test","password":"RDnB7LAR","email":"nikolay.shamayko@gmail.com"}} - 400 error, email field must be unique', async () => {
      const body = {
        name: 'Anatoly Muravyov',
        username: 'test',
        password: 'RDnB7LAR',
        email: 'nikolay.shamayko@gmail.com'
      };
      const res = await request(app.getHttpServer())
        .post('/api/admins')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        statusCode: 400,
        message: [
          'email field must be unique'
        ],
        error: 'Bad Request'
      });
    });

    test('{"body":{"name":"Anatoly Muravyov","username":"test","password":"RDnB7LAR","email":"anatoly.muravyov@gmail.com"}} - success', async () => {
      const body = {
        name: 'Anatoly Muravyov',
        username: 'test',
        password: 'RDnB7LAR',
        email: 'anatoly.muravyov@gmail.com'
      };
      const res = await request(app.getHttpServer())
        .post('/api/admins')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(201);
      expect(res.body).toMatchSchema(adminSchema);
      expect(res.body).toMatchObject({
        id: 2,
        name: 'Anatoly Muravyov',
        username: 'test',
        email: 'anatoly.muravyov@gmail.com'
      });
    });
  });

  describe('/api/admins/:id (PUT)', () => {
    test('{"params":{"id":2},"body":{"name":"Anatoly Muravyov","username":"pest","email":"anatoly.muravyov@gmail.com"}} - 401 error, invalid token', async () => {
      const body = {
        name: 'Anatoly Muravyov',
        username: 'pest',
        email: 'anatoly.muravyov@gmail.com'
      };
      const res = await request(app.getHttpServer())
        .put('/api/admins/2')
        .send(body);
      expect(res.status).toEqual(401);
      expect(res.body).toEqual({
        statusCode: 401,
        message: 'Invalid token',
        error: 'Unauthorized'
      });
    });

    test('{"params":{"id":"a"},"body":{"name":"Anatoly Muravyov","username":"pest","email":"anatoly.muravyov@gmail.com"}} - 400 error, id param must be a number', async () => {
      const body = {
        name: 'Anatoly Muravyov',
        username: 'pest',
        email: 'anatoly.muravyov@gmail.com'
      };
      const res = await request(app.getHttpServer())
        .put('/api/admins/a')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
        error: 'Bad Request'
      });
    });

    test('{"params":{"id":100},"body":{"name":"Anatoly Muravyov","username":"pest","email":"anatoly.muravyov@gmail.com"}} - 404 error, entity not found', async () => {
      const body = {
        name: 'Anatoly Muravyov',
        username: 'pest',
        email: 'anatoly.muravyov@gmail.com'
      };
      const res = await request(app.getHttpServer())
        .put('/api/admins/100')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(404);
      expect(res.body).toEqual({
        statusCode: 404,
        message: 'Not Found'
      });
    });

    test('{"params":{"id":2},"body":{"name":"Anatoly Muravyov","username":"ns16","email":"anatoly.muravyov@gmail.com"}} - 400 error, username field must be unique', async () => {
      const body = {
        name: 'Anatoly Muravyov',
        username: 'ns16',
        email: 'anatoly.muravyov@gmail.com'
      };
      const res = await request(app.getHttpServer())
        .put('/api/admins/2')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        statusCode: 400,
        message: [
          'username field must be unique'
        ],
        error: 'Bad Request'
      });
    });

    test('{"params":{"id":2},"body":{"name":"Anatoly Muravyov","username":"pest","email":"anatoly.muravyov+gmail.com"}} - 400 error, email must be an email', async () => {
      const body = {
        name: 'Anatoly Muravyov',
        username: 'pest',
        email: 'anatoly.muravyov+gmail.com'
      };
      const res = await request(app.getHttpServer())
        .put('/api/admins/2')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        statusCode: 400,
        message: [
          'email must be an email'
        ],
        error: 'Bad Request'
      });
    });

    test('{"params":{"id":2},"body":{"name":"Anatoly Muravyov","username":"pest","email":"nikolay.shamayko@gmail.com"}} - 400 error, email field must be unique', async () => {
      const body = {
        name: 'Anatoly Muravyov',
        username: 'pest',
        email: 'nikolay.shamayko@gmail.com'
      };
      const res = await request(app.getHttpServer())
        .put('/api/admins/2')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        statusCode: 400,
        message: [
          'email field must be unique'
        ],
        error: 'Bad Request'
      });
    });

    test('{"params":{"id":2},"body":{"name":"Anatoly Muravyov","username":"pest","email":"anatoly.muravyov@gmail.com"}} - success', async () => {
      const body = {
        name: 'Anatoly Muravyov',
        username: 'pest',
        email: 'anatoly.muravyov@gmail.com'
      };
      const res = await request(app.getHttpServer())
        .put('/api/admins/2')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(200);
      expect(res.body).toMatchSchema(adminSchema);
      expect(res.body).toMatchObject({
        id: 2,
        name: 'Anatoly Muravyov',
        username: 'pest',
        email: 'anatoly.muravyov@gmail.com'
      });
    });
  });

  describe('/api/admins/:id (DELETE)', () => {
    test('{"params":{"id":2}} - 401 error, invalid token', async () => {
      const res = await request(app.getHttpServer()).delete('/api/admins/2');
      expect(res.status).toEqual(401);
      expect(res.body).toEqual({
        statusCode: 401,
        message: 'Invalid token',
        error: 'Unauthorized'
      });
    });

    test('{"params":{"id":"a"}} - 400 error, id param must be a number', async () => {
      const res = await request(app.getHttpServer())
        .delete('/api/admins/a')
        .set('Authorization', authorization);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
        error: 'Bad Request'
      });
    });

    test('{"params":{"id":100}} - 404 error, entity not found', async () => {
      const res = await request(app.getHttpServer())
        .delete('/api/admins/100')
        .set('Authorization', authorization);
      expect(res.status).toEqual(404);
      expect(res.body).toEqual({
        statusCode: 404,
        message: 'Not Found'
      });
    });

    test('{"params":{"id":2}} - success', async () => {
      const res = await request(app.getHttpServer())
        .delete('/api/admins/2')
        .set('Authorization', authorization);
      expect(res.status).toEqual(204);
      expect(res.body).toEqual({});
    });
  });

  afterAll(() => TestAppManager.close());
});
