import { INestApplication } from '@nestjs/common';
import { matchers } from 'jest-json-schema';
import * as request from 'supertest';
import MigrationsManager from '../src/common/migration/migrations-manager';
import SeedsManager from '../src/common/seed/seeds-manager';
import {
  userSchema,
  usersListSchema,
  userWithArticlesSchema,
  usersWithArticlesListSchema,
  paginationSchema
} from './_tools/schemas';
import TestAppManager from './_tools/test-app-manager';

expect.extend(matchers);

describe('UsersController (e2e)', () => {

  let app: INestApplication;
  let authorization: string;

  beforeAll(async () => {
    await MigrationsManager.run();
    await SeedsManager.run();
    app = await TestAppManager.init();
    authorization = await TestAppManager.getAuthorization();
  });

  describe('/api/users (GET)', () => {
    test('{"query":{}} - 401 error, invalid token', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/users')
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
        .get('/api/users')
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
        .get('/api/users')
        .query({})
        .set('Authorization', authorization);
      expect(res.status).toEqual(200);
      expect(res.body.data).toMatchSchema(usersListSchema);
      expect(res.body.data).toHaveLength(10);
      expect(res.body.pagination).toMatchSchema(paginationSchema);
      expect(res.body.pagination).toMatchObject({
        page: 1,
        pageSize: 10,
        rowCount: 10,
        pageCount: 1
      });
    });

    describe('paging', () => {
      test('{"query":{"page":1}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users')
          .query({ page: 1 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(usersListSchema);
        expect(res.body.data).toHaveLength(10);
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 10,
          pageCount: 1
        });
      });

      test('{"query":{"page":2}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users')
          .query({ page: 2 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(usersListSchema);
        expect(res.body.data).toHaveLength(0);
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 2,
          pageSize: 10,
          rowCount: 10,
          pageCount: 1
        });
      });
    });

    describe('sorts', () => {
      test('{"query":{"sorts[id]":"asc"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users')
          .query({ 'sorts[id]': 'asc' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(usersListSchema);
        expect(res.body.data).toHaveLength(10);
        expect(res.body.data).toHaveProperty('[0].id', 1);
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 10,
          pageCount: 1
        });
      });

      test('{"query":{"sorts[id]":"desc"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users')
          .query({ 'sorts[id]': 'desc' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(usersListSchema);
        expect(res.body.data).toHaveLength(10);
        expect(res.body.data).toHaveProperty('[0].id', 10);
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 10,
          pageCount: 1
        });
      });

      test('{"query":{"sorts[username]":"asc"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users')
          .query({ 'sorts[username]': 'asc' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(usersListSchema);
        expect(res.body.data).toHaveLength(10);
        expect(res.body.data).toHaveProperty('[0].username', 'Albina_Kuphal-Zieme');
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 10,
          pageCount: 1
        });
      });

      test('{"query":{"sorts[username]":"desc"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users')
          .query({ 'sorts[username]': 'desc' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(usersListSchema);
        expect(res.body.data).toHaveLength(10);
        expect(res.body.data).toHaveProperty('[0].username', 'Sheldon52');
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 10,
          pageCount: 1
        });
      });
    });

    describe('includes', () => {
      test('{"query":{"includes":["foo"]}} - 400 error, invalid include value', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users')
          .query({ 'includes[]': 'foo' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          statusCode: 400,
          message: [
            'each value in includes must be one of the following values: articles'
          ],
          error: 'Bad Request'
        });
      });

      test('{"query":{"includes":["articles"]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users')
          .query({ 'includes[]': 'articles' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(usersWithArticlesListSchema);
        expect(res.body.data).toHaveLength(10);
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 10,
          pageCount: 1
        });
      });
    });

    describe('filters', () => {
      test('{"query":{"filters[id][foo]":5}} - 400 error, invalid filter operator', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users')
          .query({ 'filters[id][foo]': 5 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          statusCode: 400,
          message: [
            'filters.id.property foo should not exist'
          ],
          error: 'Bad Request'
        });
      });

      test('{"query":{"filters[id][$gt]":5}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users')
          .query({ 'filters[id][$gt]': 5 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(usersListSchema);
        expect(res.body.data).toHaveLength(5);
        res.body.data.forEach(item => expect(item.id).toBeGreaterThan(5));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        });
      });

      test('{"query":{"filters[id][$gte]":5}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users')
          .query({ 'filters[id][$gte]': 5 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(usersListSchema);
        expect(res.body.data).toHaveLength(6);
        res.body.data.forEach(item => expect(item.id).toBeGreaterThanOrEqual(5));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 6,
          pageCount: 1
        });
      });

      test('{"query":{"filters[id][$lt]":6}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users')
          .query({ 'filters[id][$lt]': 6 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(usersListSchema);
        expect(res.body.data).toHaveLength(5);
        res.body.data.forEach(item => expect(item.id).toBeLessThan(6));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        });
      });

      test('{"query":{"filters[id][$lte]":6}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users')
          .query({ 'filters[id][$lte]': 6 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(usersListSchema);
        expect(res.body.data).toHaveLength(6);
        res.body.data.forEach(item => expect(item.id).toBeLessThanOrEqual(6));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 6,
          pageCount: 1
        });
      });

      test('{"query":{"filters[id][$gte]":7,"filters[id][$lte]":4}} - success, only last filter', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users')
          .query({
            'filters[id][$gte]': 7,
            'filters[id][$lte]': 4
          })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(usersListSchema);
        expect(res.body.data).toHaveLength(4);
        res.body.data.forEach(item => expect(item.id).toBeLessThanOrEqual(4));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 4,
          pageCount: 1
        });
      });

      test('{"query":{"filters[id][$lte]":4,"filters[id][$gte]":7}} - success, only last filter', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users')
          .query({
            'filters[id][$lte]': 4,
            'filters[id][$gte]': 7
          })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(usersListSchema);
        expect(res.body.data).toHaveLength(4);
        res.body.data.forEach(item => expect(item.id).toBeGreaterThanOrEqual(7));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 4,
          pageCount: 1
        });
      });

      test('{"query":{"filters[id][$eq]":5}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users')
          .query({ 'filters[id][$eq]': 5 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(usersListSchema);
        expect(res.body.data).toHaveLength(1);
        res.body.data.forEach(item => expect(item.id).toEqual(5));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 1,
          pageCount: 1
        });
      });

      test('{"query":{"filters[id][$ne]":5}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users')
          .query({ 'filters[id][$ne]': 5 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(usersListSchema);
        expect(res.body.data).toHaveLength(9);
        res.body.data.forEach(item => expect(item.id).not.toEqual(5));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 9,
          pageCount: 1
        });
      });

      test('{"query":{"filters[id][$between]":[4,6]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users')
          .query({ 'filters[id][$between]': [4, 6] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(usersListSchema);
        expect(res.body.data).toHaveLength(3);
        res.body.data.forEach(item => expect(item.id >= 4 && item.id <= 6).toBeTruthy());
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 3,
          pageCount: 1
        });
      });

      test('{"query":{"filters[id][$notBetween]":[4,6]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users')
          .query({ 'filters[id][$notBetween]': [4, 6] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(usersListSchema);
        expect(res.body.data).toHaveLength(7);
        res.body.data.forEach(item => expect(item.id >= 4 && item.id <= 6).not.toBeTruthy());
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 7,
          pageCount: 1
        });
      });

      test('{"query":{"filters[id][$in]":[2,5,8]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users')
          .query({ 'filters[id][$in]': [2, 5, 8] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(usersListSchema);
        expect(res.body.data).toHaveLength(3);
        res.body.data.forEach(item => expect([2, 5, 8].includes(item.id)).toBeTruthy());
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 3,
          pageCount: 1
        });
      });

      test('{"query":{"filters[id][$notIn]":[2,5,8]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users')
          .query({ 'filters[id][$notIn]': [2, 5, 8] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(usersListSchema);
        expect(res.body.data).toHaveLength(7);
        res.body.data.forEach(item => expect([2, 5, 8].includes(item.id)).not.toBeTruthy());
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 7,
          pageCount: 1
        });
      });

      test('{"query":{"filters[username][foo]":"Sheldon52"}} - 400 error, invalid filter operator', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users')
          .query({ 'filters[username][foo]': 'Sheldon52' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          statusCode: 400,
          message: [
            'filters.username.property foo should not exist'
          ],
          error: 'Bad Request'
        });
      });

      test('{"query":{"filters[username][$eq]":"Sheldon52"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users')
          .query({ 'filters[username][$eq]': 'Sheldon52' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(usersListSchema);
        expect(res.body.data).toHaveLength(1);
        res.body.data.forEach(item => expect(item.username).toEqual('Sheldon52'));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 1,
          pageCount: 1
        });
      });

      test('{"query":{"filters[username][$ne]":"Sheldon52"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users')
          .query({ 'filters[username][$ne]': 'Sheldon52' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(usersListSchema);
        expect(res.body.data).toHaveLength(9);
        res.body.data.forEach(item => expect(item.username).not.toEqual('Sheldon52'));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 9,
          pageCount: 1
        });
      });

      test('{"query":{"filters[username][$in]":["Sheldon52","Hester_Schowalter67"]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users')
          .query({ 'filters[username][$in]': ['Sheldon52', 'Hester_Schowalter67'] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(usersListSchema);
        expect(res.body.data).toHaveLength(2);
        res.body.data.forEach(item => expect(['Sheldon52', 'Hester_Schowalter67'].includes(item.username)).toBeTruthy());
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 2,
          pageCount: 1
        });
      });

      test('{"query":{"filters[username][$notIn]":["Sheldon52","Hester_Schowalter67"]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users')
          .query({ 'filters[username][$notIn]': ['Sheldon52', 'Hester_Schowalter67'] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(usersListSchema);
        expect(res.body.data).toHaveLength(8);
        res.body.data.forEach(item => expect(['Sheldon52', 'Hester_Schowalter67'].includes(item.username)).not.toBeTruthy());
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 8,
          pageCount: 1
        });
      });

      test('{"query":{"filters[username][$like]":"a"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users')
          .query({ 'filters[username][$like]': 'a' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(usersListSchema);
        expect(res.body.data).toHaveLength(5);
        res.body.data.forEach(item => expect(item.username).toMatch('a'));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        });
      });

      test('{"query":{"filters[username][$notLike]":"a"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users')
          .query({ 'filters[username][$notLike]': 'a' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(usersListSchema);
        expect(res.body.data).toHaveLength(5);
        res.body.data.forEach(item => expect(item.username).not.toMatch('a'));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        });
      });

      test('{"query":{"filters[username][$like]":"b","filters[username][$notLike]":"b"}} - success, only last filter', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users')
          .query({
            'filters[username][$like]': 'b',
            'filters[username][$notLike]': 'b'
          })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(usersListSchema);
        expect(res.body.data).toHaveLength(9);
        res.body.data.forEach(item => expect(item.username).not.toMatch('b'));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 9,
          pageCount: 1
        });
      });

      test('{"query":{"filters[username][$notLike]":"b","filters[username][$like]":"b"}} - success, only last filter', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users')
          .query({
            'filters[username][$notLike]': 'b',
            'filters[username][$like]': 'b'
          })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(usersListSchema);
        expect(res.body.data).toHaveLength(1);
        res.body.data.forEach(item => expect(item.username).toMatch('b'));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 1,
          pageCount: 1
        });
      });
    });
  });

  describe('/api/users/all (GET)', () => {
    test('{"query":{}} - 401 error, invalid token', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/users/all')
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
        .get('/api/users/all')
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
        .get('/api/users/all')
        .query({})
        .set('Authorization', authorization);
      expect(res.status).toEqual(200);
      expect(res.body).toMatchSchema(usersListSchema);
      expect(res.body).toHaveLength(10);
    });

    describe('sorts', () => {
      test('{"query":{"sorts[id]":"asc"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users/all')
          .query({ 'sorts[id]': 'asc' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(usersListSchema);
        expect(res.body).toHaveLength(10);
        expect(res.body).toHaveProperty('[0].id', 1);
      });

      test('{"query":{"sorts[id]":"desc"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users/all')
          .query({ 'sorts[id]': 'desc' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(usersListSchema);
        expect(res.body).toHaveLength(10);
        expect(res.body).toHaveProperty('[0].id', 10);
      });

      test('{"query":{"sorts[username]":"asc"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users/all')
          .query({ 'sorts[username]': 'asc' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(usersListSchema);
        expect(res.body).toHaveLength(10);
        expect(res.body).toHaveProperty('[0].username', 'Albina_Kuphal-Zieme');
      });

      test('{"query":{"sorts[username]":"desc"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users/all')
          .query({ 'sorts[username]': 'desc' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(usersListSchema);
        expect(res.body).toHaveLength(10);
        expect(res.body).toHaveProperty('[0].username', 'Sheldon52');
      });
    });

    describe('includes', () => {
      test('{"query":{"includes":["foo"]}} - 400 error, invalid include value', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users/all')
          .query({ 'includes[]': 'foo' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          statusCode: 400,
          message: [
            'each value in includes must be one of the following values: articles'
          ],
          error: 'Bad Request'
        });
      });

      test('{"query":{"includes":["articles"]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users/all')
          .query({ 'includes[]': 'articles' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(usersWithArticlesListSchema);
        expect(res.body).toHaveLength(10);
      });
    });

    describe('filters', () => {
      test('{"query":{"filters[id][foo]":5}} - 400 error, invalid filter operator', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users/all')
          .query({ 'filters[id][foo]': 5 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          statusCode: 400,
          message: [
            'filters.id.property foo should not exist'
          ],
          error: 'Bad Request'
        });
      });

      test('{"query":{"filters[id][$gt]":5}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users/all')
          .query({ 'filters[id][$gt]': 5 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(usersListSchema);
        expect(res.body).toHaveLength(5);
        res.body.forEach(item => expect(item.id).toBeGreaterThan(5));
      });

      test('{"query":{"filters[id][$gte]":5}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users/all')
          .query({ 'filters[id][$gte]': 5 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(usersListSchema);
        expect(res.body).toHaveLength(6);
        res.body.forEach(item => expect(item.id).toBeGreaterThanOrEqual(5));
      });

      test('{"query":{"filters[id][$lt]":6}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users/all')
          .query({ 'filters[id][$lt]': 6 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(usersListSchema);
        expect(res.body).toHaveLength(5);
        res.body.forEach(item => expect(item.id).toBeLessThan(6));
      });

      test('{"query":{"filters[id][$lte]":6}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users/all')
          .query({ 'filters[id][$lte]': 6 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(usersListSchema);
        expect(res.body).toHaveLength(6);
        res.body.forEach(item => expect(item.id).toBeLessThanOrEqual(6));
      });

      test('{"query":{"filters[id][$gte]":7,"filters[id][$lte]":4}} - success, only last filter', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users/all')
          .query({
            'filters[id][$gte]': 7,
            'filters[id][$lte]': 4
          })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(usersListSchema);
        expect(res.body).toHaveLength(4);
        res.body.forEach(item => expect(item.id).toBeLessThanOrEqual(4));
      });

      test('{"query":{"filters[id][$lte]":4,"filters[id][$gte]":7}} - success, only last filter', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users/all')
          .query({
            'filters[id][$lte]': 4,
            'filters[id][$gte]': 7
          })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(usersListSchema);
        expect(res.body).toHaveLength(4);
        res.body.forEach(item => expect(item.id).toBeGreaterThanOrEqual(7));
      });

      test('{"query":{"filters[id][$eq]":5}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users/all')
          .query({ 'filters[id][$eq]': 5 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(usersListSchema);
        expect(res.body).toHaveLength(1);
        res.body.forEach(item => expect(item.id).toEqual(5));
      });

      test('{"query":{"filters[id][$ne]":5}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users/all')
          .query({ 'filters[id][$ne]': 5 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(usersListSchema);
        expect(res.body).toHaveLength(9);
        res.body.forEach(item => expect(item.id).not.toEqual(5));
      });

      test('{"query":{"filters[id][$between]":[4,6]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users/all')
          .query({ 'filters[id][$between]': [4, 6] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(usersListSchema);
        expect(res.body).toHaveLength(3);
        res.body.forEach(item => expect(item.id >= 4 && item.id <= 6).toBeTruthy());
      });

      test('{"query":{"filters[id][$notBetween]":[4,6]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users/all')
          .query({ 'filters[id][$notBetween]': [4, 6] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(usersListSchema);
        expect(res.body).toHaveLength(7);
        res.body.forEach(item => expect(item.id >= 4 && item.id <= 6).not.toBeTruthy());
      });

      test('{"query":{"filters[id][$in]":[2,5,8]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users/all')
          .query({ 'filters[id][$in]': [2, 5, 8] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(usersListSchema);
        expect(res.body).toHaveLength(3);
        res.body.forEach(item => expect([2, 5, 8].includes(item.id)).toBeTruthy());
      });

      test('{"query":{"filters[id][$notIn]":[2,5,8]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users/all')
          .query({ 'filters[id][$notIn]': [2, 5, 8] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(usersListSchema);
        expect(res.body).toHaveLength(7);
        res.body.forEach(item => expect([2, 5, 8].includes(item.id)).not.toBeTruthy());
      });

      test('{"query":{"filters[username][foo]":"Sheldon52"}} - 400 error, invalid filter operator', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users/all')
          .query({ 'filters[username][foo]': 'Sheldon52' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          statusCode: 400,
          message: [
            'filters.username.property foo should not exist'
          ],
          error: 'Bad Request'
        });
      });

      test('{"query":{"filters[username][$eq]":"Sheldon52"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users/all')
          .query({ 'filters[username][$eq]': 'Sheldon52' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(usersListSchema);
        expect(res.body).toHaveLength(1);
        res.body.forEach(item => expect(item.username).toEqual('Sheldon52'));
      });

      test('{"query":{"filters[username][$ne]":"Sheldon52"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users/all')
          .query({ 'filters[username][$ne]': 'Sheldon52' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(usersListSchema);
        expect(res.body).toHaveLength(9);
        res.body.forEach(item => expect(item.username).not.toEqual('Sheldon52'));
      });

      test('{"query":{"filters[username][$in]":["Sheldon52","Hester_Schowalter67"]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users/all')
          .query({ 'filters[username][$in]': ['Sheldon52', 'Hester_Schowalter67'] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(usersListSchema);
        expect(res.body).toHaveLength(2);
        res.body.forEach(item => expect(['Sheldon52', 'Hester_Schowalter67'].includes(item.username)).toBeTruthy());
      });

      test('{"query":{"filters[username][$notIn]":["Sheldon52","Hester_Schowalter67"]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users/all')
          .query({ 'filters[username][$notIn]': ['Sheldon52', 'Hester_Schowalter67'] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(usersListSchema);
        expect(res.body).toHaveLength(8);
        res.body.forEach(item => expect(['Sheldon52', 'Hester_Schowalter67'].includes(item.username)).not.toBeTruthy());
      });

      test('{"query":{"filters[username][$like]":"a"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users/all')
          .query({ 'filters[username][$like]': 'a' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(usersListSchema);
        expect(res.body).toHaveLength(5);
        res.body.forEach(item => expect(item.username).toMatch('a'));
      });

      test('{"query":{"filters[username][$notLike]":"a"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users/all')
          .query({ 'filters[username][$notLike]': 'a' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(usersListSchema);
        expect(res.body).toHaveLength(5);
        res.body.forEach(item => expect(item.username).not.toMatch('a'));
      });

      test('{"query":{"filters[username][$like]":"b","filters[username][$notLike]":"b"}} - success, only last filter', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users/all')
          .query({
            'filters[username][$like]': 'b',
            'filters[username][$notLike]': 'b'
          })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(usersListSchema);
        expect(res.body).toHaveLength(9);
        res.body.forEach(item => expect(item.username).not.toMatch('b'));
      });

      test('{"query":{"filters[username][$notLike]":"b","filters[username][$like]":"b"}} - success, only last filter', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users/all')
          .query({
            'filters[username][$notLike]': 'b',
            'filters[username][$like]': 'b'
          })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(usersListSchema);
        expect(res.body).toHaveLength(1);
        res.body.forEach(item => expect(item.username).toMatch('b'));
      });
    });
  });

  describe('/api/users/:id (GET)', () => {
    test('{"params":{"id":1},"query":{}} - 401 error, invalid token', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/users/1')
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
        .get('/api/users/a')
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
        .get('/api/users/100')
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
        .get('/api/users/1')
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
        .get('/api/users/1')
        .query({})
        .set('Authorization', authorization);
      expect(res.status).toEqual(200);
      expect(res.body).toMatchSchema(userSchema);
      expect(res.body).toHaveProperty('id', 1);
    });

    describe('includes', () => {
      test('{"params":{"id":1},{"query":{"includes":["foo"]}} - 400 error, invalid include value', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users/1')
          .query({ 'includes[]': 'foo' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          statusCode: 400,
          message: [
            'each value in includes must be one of the following values: articles'
          ],
          error: 'Bad Request'
        });
      });

      test('{"params":{"id":1},{"query":{"includes":["articles"]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users/1')
          .query({ 'includes[]': 'articles' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(userWithArticlesSchema);
        expect(res.body).toHaveProperty('id', 1);
      });
    });
  });

  describe('/api/users (POST)', () => {
    test('{"body":{"name":"Rosalind Trantow","username":"Rosalind4","password":"Y9ECfszZ","email":"Rosalind.Trantow35@gmail.com"}} - 401 error, invalid token', async () => {
      const body = {
        name: 'Rosalind Trantow',
        username: 'Rosalind4',
        password: 'Y9ECfszZ',
        email: 'Rosalind.Trantow35@gmail.com'
      };
      const res = await request(app.getHttpServer())
        .post('/api/users')
        .send(body);
      expect(res.status).toEqual(401);
      expect(res.body).toEqual({
        statusCode: 401,
        message: 'Invalid token',
        error: 'Unauthorized'
      });
    });

    test('{"body":{"name":"Rosalind Trantow","username":"Sheldon52","password":"Y9ECfszZ","email":"Rosalind.Trantow35@gmail.com"}} - 400 error, username field must be unique', async () => {
      const body = {
        name: 'Rosalind Trantow',
        username: 'Sheldon52',
        password: 'Y9ECfszZ',
        email: 'Rosalind.Trantow35@gmail.com'
      };
      const res = await request(app.getHttpServer())
        .post('/api/users')
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

    test('{"body":{"name":"Rosalind Trantow","username":"Rosalind4","password":"Y9ECfszZ","email":"Rosalind.Trantow35+gmail.com"}} - 400 error, email must be an email', async () => {
      const body = {
        name: 'Rosalind Trantow',
        username: 'Rosalind4',
        password: 'Y9ECfszZ',
        email: 'Rosalind.Trantow35+gmail.com'
      };
      const res = await request(app.getHttpServer())
        .post('/api/users')
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

    test('{"body":{"name":"Rosalind Trantow","username":"Rosalind4","password":"Y9ECfszZ","email":"Sheldon_Bahringer6@yahoo.com"}} - 400 error, email field must be unique', async () => {
      const body = {
        name: 'Rosalind Trantow',
        username: 'Rosalind4',
        password: 'Y9ECfszZ',
        email: 'Sheldon_Bahringer6@yahoo.com'
      };
      const res = await request(app.getHttpServer())
        .post('/api/users')
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

    test('{"body":{"name":"Rosalind Trantow","username":"Rosalind4","password":"Y9ECfszZ","email":"Rosalind.Trantow35@gmail.com"}} - success', async () => {
      const body = {
        name: 'Rosalind Trantow',
        username: 'Rosalind4',
        password: 'Y9ECfszZ',
        email: 'Rosalind.Trantow35@gmail.com'
      };
      const res = await request(app.getHttpServer())
        .post('/api/users')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(201);
      expect(res.body).toMatchSchema(userSchema);
      expect(res.body).toMatchObject({
        id: 11,
        name: 'Rosalind Trantow',
        username: 'Rosalind4',
        email: 'Rosalind.Trantow35@gmail.com'
      });
    });
  });

  describe('/api/users/:id (PUT)', () => {
    test('{"params":{"id":11},"body":{"name":"Rosalind Trantow","username":"Rosalind5","email":"Rosalind.Trantow35@gmail.com"}} - 401 error, invalid token', async () => {
      const body = {
        name: 'Rosalind Trantow',
        username: 'Rosalind5',
        email: 'Rosalind.Trantow35@gmail.com'
      };
      const res = await request(app.getHttpServer())
        .put('/api/users/11')
        .send(body);
      expect(res.status).toEqual(401);
      expect(res.body).toEqual({
        statusCode: 401,
        message: 'Invalid token',
        error: 'Unauthorized'
      });
    });

    test('{"params":{"id":"a"},"body":{"name":"Rosalind Trantow","username":"Rosalind5","email":"Rosalind.Trantow35@gmail.com"}} - 400 error, id param must be a number', async () => {
      const body = {
        name: 'Rosalind Trantow',
        username: 'Rosalind5',
        email: 'Rosalind.Trantow35@gmail.com'
      };
      const res = await request(app.getHttpServer())
        .put('/api/users/a')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
        error: 'Bad Request'
      });
    });

    test('{"params":{"id":100},"body":{"name":"Rosalind Trantow","username":"Rosalind5","email":"Rosalind.Trantow35@gmail.com"}} - 404 error, entity not found', async () => {
      const body = {
        name: 'Rosalind Trantow',
        username: 'Rosalind5',
        email: 'Rosalind.Trantow35@gmail.com'
      };
      const res = await request(app.getHttpServer())
        .put('/api/users/100')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(404);
      expect(res.body).toEqual({
        statusCode: 404,
        message: 'Not Found'
      });
    });

    test('{"params":{"id":11},"body":{"name":"Rosalind Trantow","username":"Sheldon52","email":"Rosalind.Trantow35@gmail.com"}} - 400 error, username field must be unique', async () => {
      const body = {
        name: 'Rosalind Trantow',
        username: 'Sheldon52',
        email: 'Rosalind.Trantow35@gmail.com'
      };
      const res = await request(app.getHttpServer())
        .put('/api/users/11')
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

    test('{"params":{"id":11},"body":{"name":"Rosalind Trantow","username":"Rosalind5","email":"Rosalind.Trantow35+gmail.com"}} - 400 error, email must be an email', async () => {
      const body = {
        name: 'Rosalind Trantow',
        username: 'Rosalind5',
        email: 'Rosalind.Trantow35+gmail.com'
      };
      const res = await request(app.getHttpServer())
        .put('/api/users/11')
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

    test('{"params":{"id":11},"body":{"name":"Rosalind Trantow","username":"Rosalind5","email":"Sheldon_Bahringer6@yahoo.com"}} - 400 error, email field must be unique', async () => {
      const body = {
        name: 'Rosalind Trantow',
        username: 'Rosalind5',
        email: 'Sheldon_Bahringer6@yahoo.com'
      };
      const res = await request(app.getHttpServer())
        .put('/api/users/11')
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

    test('{"params":{"id":11},"body":{"name":"Rosalind Trantow","username":"Rosalind5","email":"Rosalind.Trantow35@gmail.com"}} - success', async () => {
      const body = {
        name: 'Rosalind Trantow',
        username: 'Rosalind5',
        email: 'Rosalind.Trantow35@gmail.com'
      };
      const res = await request(app.getHttpServer())
        .put('/api/users/11')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(200);
      expect(res.body).toMatchSchema(userSchema);
      expect(res.body).toMatchObject({
        id: 11,
        name: 'Rosalind Trantow',
        username: 'Rosalind5',
        email: 'Rosalind.Trantow35@gmail.com'
      });
    });
  });

  describe('/api/users/:id (DELETE)', () => {
    test('{"params":{"id":11}} - 401 error, invalid token', async () => {
      const res = await request(app.getHttpServer()).delete('/api/users/11');
      expect(res.status).toEqual(401);
      expect(res.body).toEqual({
        statusCode: 401,
        message: 'Invalid token',
        error: 'Unauthorized'
      });
    });

    test('{"params":{"id":"a"}} - 400 error, id param must be a number', async () => {
      const res = await request(app.getHttpServer())
        .delete('/api/users/a')
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
        .delete('/api/users/100')
        .set('Authorization', authorization);
      expect(res.status).toEqual(404);
      expect(res.body).toEqual({
        statusCode: 404,
        message: 'Not Found'
      });
    });

    test('{"params":{"id":11}} - success', async () => {
      const res = await request(app.getHttpServer())
        .delete('/api/users/11')
        .set('Authorization', authorization);
      expect(res.status).toEqual(204);
      expect(res.body).toEqual({});
    });
  });

  afterAll(() => TestAppManager.close());
});
