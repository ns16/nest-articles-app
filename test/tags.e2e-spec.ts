import { INestApplication } from '@nestjs/common';
import { matchers } from 'jest-json-schema';
import * as request from 'supertest';
import MigrationsManager from '../src/common/migration/migrations-manager';
import SeedsManager from '../src/common/seed/seeds-manager';
import {
  tagSchema,
  tagsListSchema,
  tagWithArticlesSchema,
  tagsWithArticlesListSchema,
  paginationSchema
} from './_tools/schemas';
import TestAppManager from './_tools/test-app-manager';

expect.extend(matchers);

describe('TagsController (e2e)', () => {

  let app: INestApplication;
  let authorization: string;

  beforeAll(async () => {
    await MigrationsManager.run();
    await SeedsManager.run();
    app = await TestAppManager.init();
    authorization = await TestAppManager.getAuthorization();
  });

  describe('/api/tags (GET)', () => {
    test('{"query":{}} - 401 error, invalid token', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/tags')
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
        .get('/api/tags')
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
        .get('/api/tags')
        .query({})
        .set('Authorization', authorization);
      expect(res.status).toEqual(200);
      expect(res.body.data).toMatchSchema(tagsListSchema);
      expect(res.body.data).toHaveLength(5);
      expect(res.body.pagination).toMatchSchema(paginationSchema);
      expect(res.body.pagination).toMatchObject({
        page: 1,
        pageSize: 10,
        rowCount: 5,
        pageCount: 1
      });
    });

    describe('paging', () => {
      test('{"query":{"page":1}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags')
          .query({ page: 1 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(tagsListSchema);
        expect(res.body.data).toHaveLength(5);
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        });
      });

      test('{"query":{"page":2}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags')
          .query({ page: 2 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(tagsListSchema);
        expect(res.body.data).toHaveLength(0);
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 2,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        });
      });
    });

    describe('sorts', () => {
      test('{"query":{"sorts[id]":"asc"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags')
          .query({ 'sorts[id]': 'asc' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(tagsListSchema);
        expect(res.body.data).toHaveLength(5);
        expect(res.body.data).toHaveProperty('[0].id', 1);
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        });
      });

      test('{"query":{"sorts[id]":"desc"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags')
          .query({ 'sorts[id]': 'desc' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(tagsListSchema);
        expect(res.body.data).toHaveLength(5);
        expect(res.body.data).toHaveProperty('[0].id', 5);
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        });
      });

      test('{"query":{"sorts[name]":"asc"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags')
          .query({ 'sorts[name]': 'asc' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(tagsListSchema);
        expect(res.body.data).toHaveLength(5);
        expect(res.body.data).toHaveProperty('[0].name', 'aliquam');
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        });
      });

      test('{"query":{"sorts[name]":"desc"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags')
          .query({ 'sorts[name]': 'desc' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(tagsListSchema);
        expect(res.body.data).toHaveLength(5);
        expect(res.body.data).toHaveProperty('[0].name', 'veniam');
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        });
      });
    });

    describe('includes', () => {
      test('{"query":{"includes":["foo"]}} - 400 error, invalid include value', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags')
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
          .get('/api/tags')
          .query({ 'includes[]': 'articles' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(tagsWithArticlesListSchema);
        expect(res.body.data).toHaveLength(5);
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        });
      });
    });

    describe('filters', () => {
      test('{"query":{"filters[id][foo]":3}} - 400 error, invalid filter operator', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags')
          .query({ 'filters[id][foo]': 3 })
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

      test('{"query":{"filters[id][$gt]":2}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags')
          .query({ 'filters[id][$gt]': 2 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(tagsListSchema);
        expect(res.body.data).toHaveLength(3);
        res.body.data.forEach(item => expect(item.id).toBeGreaterThan(2));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 3,
          pageCount: 1
        });
      });

      test('{"query":{"filters[id][$gte]":2}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags')
          .query({ 'filters[id][$gte]': 2 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(tagsListSchema);
        expect(res.body.data).toHaveLength(4);
        res.body.data.forEach(item => expect(item.id).toBeGreaterThanOrEqual(2));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 4,
          pageCount: 1
        });
      });

      test('{"query":{"filters[id][$lt]":4}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags')
          .query({ 'filters[id][$lt]': 4 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(tagsListSchema);
        expect(res.body.data).toHaveLength(3);
        res.body.data.forEach(item => expect(item.id).toBeLessThan(4));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 3,
          pageCount: 1
        });
      });

      test('{"query":{"filters[id][$lte]":4}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags')
          .query({ 'filters[id][$lte]': 4 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(tagsListSchema);
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

      test('{"query":{"filters[id][$gte]":2,"filters[id][$lte]":4}} - success, only last filter', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags')
          .query({
            'filters[id][$gte]': 2,
            'filters[id][$lte]': 4
          })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(tagsListSchema);
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

      test('{"query":{"filters[id][$lte]":4,"filters[id][$gte]":2}} - success, only last filter', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags')
          .query({
            'filters[id][$lte]': 4,
            'filters[id][$gte]': 2
          })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(tagsListSchema);
        expect(res.body.data).toHaveLength(4);
        res.body.data.forEach(item => expect(item.id).toBeGreaterThanOrEqual(2));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 4,
          pageCount: 1
        });
      });

      test('{"query":{"filters[id][$eq]":3}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags')
          .query({ 'filters[id][$eq]': 3 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(tagsListSchema);
        expect(res.body.data).toHaveLength(1);
        res.body.data.forEach(item => expect(item.id).toEqual(3));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 1,
          pageCount: 1
        });
      });

      test('{"query":{"filters[id][$ne]":3}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags')
          .query({ 'filters[id][$ne]': 3 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(tagsListSchema);
        expect(res.body.data).toHaveLength(4);
        res.body.data.forEach(item => expect(item.id).not.toEqual(3));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 4,
          pageCount: 1
        });
      });

      test('{"query":{"filters[id][$between]":[2,4]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags')
          .query({ 'filters[id][$between]': [2, 4] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(tagsListSchema);
        expect(res.body.data).toHaveLength(3);
        res.body.data.forEach(item => expect(item.id >= 2 && item.id <= 4).toBeTruthy());
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 3,
          pageCount: 1
        });
      });

      test('{"query":{"filters[id][$notBetween]":[2,4]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags')
          .query({ 'filters[id][$notBetween]': [2, 4] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(tagsListSchema);
        expect(res.body.data).toHaveLength(2);
        res.body.data.forEach(item => expect(item.id >= 2 && item.id <= 4).not.toBeTruthy());
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 2,
          pageCount: 1
        });
      });

      test('{"query":{"filters[id][$in]":[2,4]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags')
          .query({ 'filters[id][$in]': [2, 4] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(tagsListSchema);
        expect(res.body.data).toHaveLength(2);
        res.body.data.forEach(item => expect([2, 4].includes(item.id)).toBeTruthy());
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 2,
          pageCount: 1
        });
      });

      test('{"query":{"filters[id][$notIn]":[2,4]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags')
          .query({ 'filters[id][$notIn]': [2, 4] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(tagsListSchema);
        expect(res.body.data).toHaveLength(3);
        res.body.data.forEach(item => expect([2, 4].includes(item.id)).not.toBeTruthy());
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 3,
          pageCount: 1
        });
      });

      test('{"query":{"filters[name][foo]":"nulla"}} - 400 error, invalid filter operator', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags')
          .query({ 'filters[name][foo]': 'nulla' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          statusCode: 400,
          message: [
            'filters.name.property foo should not exist'
          ],
          error: 'Bad Request'
        });
      });

      test('{"query":{"filters[name][$eq]":"nulla"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags')
          .query({ 'filters[name][$eq]': 'nulla' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(tagsListSchema);
        expect(res.body.data).toHaveLength(1);
        res.body.data.forEach(item => expect(item.name).toEqual('nulla'));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 1,
          pageCount: 1
        });
      });

      test('{"query":{"filters[name][$ne]":"nulla"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags')
          .query({ 'filters[name][$ne]': 'nulla' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(tagsListSchema);
        expect(res.body.data).toHaveLength(4);
        res.body.data.forEach(item => expect(item.name).not.toEqual('nulla'));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 4,
          pageCount: 1
        });
      });

      test('{"query":{"filters[name][$in]":["rem","perferendis"]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags')
          .query({ 'filters[name][$in]': ['rem', 'perferendis'] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(tagsListSchema);
        expect(res.body.data).toHaveLength(2);
        res.body.data.forEach(item => expect(['rem', 'perferendis'].includes(item.name)).toBeTruthy());
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 2,
          pageCount: 1
        });
      });

      test('{"query":{"filters[name][$notIn]":["rem","perferendis"]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags')
          .query({ 'filters[name][$notIn]': ['rem', 'perferendis'] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(tagsListSchema);
        expect(res.body.data).toHaveLength(3);
        res.body.data.forEach(item => expect(['rem', 'perferendis'].includes(item.name)).not.toBeTruthy());
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 3,
          pageCount: 1
        });
      });

      test('{"query":{"filters[name][$like]":"a"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags')
          .query({ 'filters[name][$like]': 'a' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(tagsListSchema);
        expect(res.body.data).toHaveLength(3);
        res.body.data.forEach(item => expect(item.name).toMatch('a'));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 3,
          pageCount: 1
        });
      });

      test('{"query":{"filters[name][$notLike]":"a"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags')
          .query({ 'filters[name][$notLike]': 'a' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(tagsListSchema);
        expect(res.body.data).toHaveLength(2);
        res.body.data.forEach(item => expect(item.name).not.toMatch('a'));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 2,
          pageCount: 1
        });
      });

      test('{"query":{"filters[name][$like]":"a","filters[name][$notLike]":"a"}} - success, only last filter', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags')
          .query({
            'filters[name][$like]': 'a',
            'filters[name][$notLike]': 'a'
          })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(tagsListSchema);
        expect(res.body.data).toHaveLength(2);
        res.body.data.forEach(item => expect(item.name).not.toMatch('a'));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 2,
          pageCount: 1
        });
      });

      test('{"query":{"filters[name][$notLike]":"a","filters[name][$like]":"a"}} - success, only last filter', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags')
          .query({
            'filters[name][$notLike]': 'a',
            'filters[name][$like]': 'a'
          })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(tagsListSchema);
        expect(res.body.data).toHaveLength(3);
        res.body.data.forEach(item => expect(item.name).toMatch('a'));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 3,
          pageCount: 1
        });
      });
    });
  });

  describe('/api/tags/all (GET)', () => {
    test('{"query":{}} - 401 error, invalid token', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/tags/all')
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
        .get('/api/tags/all')
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
        .get('/api/tags/all')
        .query({})
        .set('Authorization', authorization);
      expect(res.status).toEqual(200);
      expect(res.body).toMatchSchema(tagsListSchema);
      expect(res.body).toHaveLength(5);
    });

    describe('sorts', () => {
      test('{"query":{"sorts[id]":"asc"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags/all')
          .query({ 'sorts[id]': 'asc' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(tagsListSchema);
        expect(res.body).toHaveLength(5);
        expect(res.body).toHaveProperty('[0].id', 1);
      });

      test('{"query":{"sorts[id]":"desc"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags/all')
          .query({ 'sorts[id]': 'desc' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(tagsListSchema);
        expect(res.body).toHaveLength(5);
        expect(res.body).toHaveProperty('[0].id', 5);
      });

      test('{"query":{"sorts[body]":"asc"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags/all')
          .query({ 'sorts[name]': 'asc' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(tagsListSchema);
        expect(res.body).toHaveLength(5);
        expect(res.body).toHaveProperty('[0].name', 'aliquam');
      });

      test('{"query":{"sorts[body]":"desc"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags/all')
          .query({ 'sorts[name]': 'desc' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(tagsListSchema);
        expect(res.body).toHaveLength(5);
        expect(res.body).toHaveProperty('[0].name', 'veniam');
      });
    });

    describe('includes', () => {
      test('{"query":{"includes":["foo"]}} - 400 error, invalid include value', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags/all')
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
          .get('/api/tags/all')
          .query({ 'includes[]': 'articles' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(tagsWithArticlesListSchema);
        expect(res.body).toHaveLength(5);
      });
    });

    describe('filters', () => {
      test('{"query":{"filters[id][foo]":3}} - 400 error, invalid filter operator', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags/all')
          .query({ 'filters[id][foo]': 3 })
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

      test('{"query":{"filters[id][$gt]":2}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags/all')
          .query({ 'filters[id][$gt]': 2 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(tagsListSchema);
        expect(res.body).toHaveLength(3);
        res.body.forEach(item => expect(item.id).toBeGreaterThan(2));
      });

      test('{"query":{"filters[id][$gte]":2}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags/all')
          .query({ 'filters[id][$gte]': 2 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(tagsListSchema);
        expect(res.body).toHaveLength(4);
        res.body.forEach(item => expect(item.id).toBeGreaterThanOrEqual(2));
      });

      test('{"query":{"filters[id][$lt]":4}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags/all')
          .query({ 'filters[id][$lt]': 4 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(tagsListSchema);
        expect(res.body).toHaveLength(3);
        res.body.forEach(item => expect(item.id).toBeLessThan(4));
      });

      test('{"query":{"filters[id][$lte]":4}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags/all')
          .query({ 'filters[id][$lte]': 4 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(tagsListSchema);
        expect(res.body).toHaveLength(4);
        res.body.forEach(item => expect(item.id).toBeLessThanOrEqual(4));
      });

      test('{"query":{"filters[id][$gte]":2,"filters[id][$lte]":4}} - success, only last filter', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags/all')
          .query({
            'filters[id][$gte]': 2,
            'filters[id][$lte]': 4
          })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(tagsListSchema);
        expect(res.body).toHaveLength(4);
        res.body.forEach(item => expect(item.id).toBeLessThanOrEqual(4));
      });

      test('{"query":{"filters[id][$lte]":4,"filters[id][$gte]":2}} - success, only last filter', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags/all')
          .query({
            'filters[id][$lte]': 4,
            'filters[id][$gte]': 2
          })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(tagsListSchema);
        expect(res.body).toHaveLength(4);
        res.body.forEach(item => expect(item.id).toBeGreaterThanOrEqual(2));
      });

      test('{"query":{"filters[id][$eq]":3}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags/all')
          .query({ 'filters[id][$eq]': 3 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(tagsListSchema);
        expect(res.body).toHaveLength(1);
        res.body.forEach(item => expect(item.id).toEqual(3));
      });

      test('{"query":{"filters[id][$ne]":3}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags/all')
          .query({ 'filters[id][$ne]': 3 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(tagsListSchema);
        expect(res.body).toHaveLength(4);
        res.body.forEach(item => expect(item.id).not.toEqual(3));
      });

      test('{"query":{"filters[id][$between]":[2,4]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags/all')
          .query({ 'filters[id][$between]': [2, 4] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(tagsListSchema);
        expect(res.body).toHaveLength(3);
        res.body.forEach(item => expect(item.id >= 2 && item.id <= 4).toBeTruthy());
      });

      test('{"query":{"filters[id][$notBetween]":[2,4]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags/all')
          .query({ 'filters[id][$notBetween]': [2, 4] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(tagsListSchema);
        expect(res.body).toHaveLength(2);
        res.body.forEach(item => expect(item.id >= 2 && item.id <= 4).not.toBeTruthy());
      });

      test('{"query":{"filters[id][$in]":[2,4]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags/all')
          .query({ 'filters[id][$in]': [2, 4] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(tagsListSchema);
        expect(res.body).toHaveLength(2);
        res.body.forEach(item => expect([2, 4].includes(item.id)).toBeTruthy());
      });

      test('{"query":{"filters[id][$notIn]":[2,4]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags/all')
          .query({ 'filters[id][$notIn]': [2, 4] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(tagsListSchema);
        expect(res.body).toHaveLength(3);
        res.body.forEach(item => expect([2, 4].includes(item.id)).not.toBeTruthy());
      });

      test('{"query":{"filters[name][foo]":"nulla"}} - 400 error, invalid filter operator', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags/all')
          .query({ 'filters[name][foo]': 'nulla' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          statusCode: 400,
          message: [
            'filters.name.property foo should not exist'
          ],
          error: 'Bad Request'
        });
      });

      test('{"query":{"filters[name][$eq]":"nulla"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags/all')
          .query({ 'filters[name][$eq]': 'nulla' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(tagsListSchema);
        expect(res.body).toHaveLength(1);
        res.body.forEach(item => expect(item.name).toEqual('nulla'));
      });

      test('{"query":{"filters[name][$ne]":"nulla"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags/all')
          .query({ 'filters[name][$ne]': 'nulla' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(tagsListSchema);
        expect(res.body).toHaveLength(4);
        res.body.forEach(item => expect(item.name).not.toEqual('nulla'));
      });

      test('{"query":{"filters[name][$in]":["rem","perferendis"]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags/all')
          .query({ 'filters[name][$in]': ['rem', 'perferendis'] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(tagsListSchema);
        expect(res.body).toHaveLength(2);
        res.body.forEach(item => expect(['rem', 'perferendis'].includes(item.name)).toBeTruthy());
      });

      test('{"query":{"filters[name][$notIn]":["rem","perferendis"]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags/all')
          .query({ 'filters[name][$notIn]': ['rem', 'perferendis'] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(tagsListSchema);
        expect(res.body).toHaveLength(3);
        res.body.forEach(item => expect(['rem', 'perferendis'].includes(item.name)).not.toBeTruthy());
      });

      test('{"query":{"filters[name][$like]":"a"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags/all')
          .query({ 'filters[name][$like]': 'a' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(tagsListSchema);
        expect(res.body).toHaveLength(3);
        res.body.forEach(item => expect(item.name).toMatch('a'));
      });

      test('{"query":{"filters[name][$notLike]":"a"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags/all')
          .query({ 'filters[name][$notLike]': 'a' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(tagsListSchema);
        expect(res.body).toHaveLength(2);
        res.body.forEach(item => expect(item.name).not.toMatch('a'));
      });

      test('{"query":{"filters[name][$like]":"a","filters[name][$notLike]":"a"}} - success, only last filter', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags/all')
          .query({
            'filters[name][$like]': 'a',
            'filters[name][$notLike]': 'a'
          })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(tagsListSchema);
        expect(res.body).toHaveLength(2);
        res.body.forEach(item => expect(item.name).not.toMatch('a'));
      });

      test('{"query":{"filters[name][$notLike]":"a","filters[name][$like]":"a"}} - success, only last filter', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags/all')
          .query({
            'filters[name][$notLike]': 'a',
            'filters[name][$like]': 'a'
          })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(tagsListSchema);
        expect(res.body).toHaveLength(3);
        res.body.forEach(item => expect(item.name).toMatch('a'));
      });
    });
  });

  describe('/api/tags/:id (GET)', () => {
    test('{"params":{"id":1},"query":{}} - 401 error, invalid token', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/tags/1')
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
        .get('/api/tags/a')
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
        .get('/api/tags/100')
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
        .get('/api/tags/1')
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
        .get('/api/tags/1')
        .query({})
        .set('Authorization', authorization);
      expect(res.status).toEqual(200);
      expect(res.body).toMatchSchema(tagSchema);
      expect(res.body).toHaveProperty('id', 1);
    });

    describe('includes', () => {
      test('{"params":{"id":1},{"query":{"includes":["foo"]}} - 400 error, invalid include value', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/tags/1')
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
          .get('/api/tags/1')
          .query({ 'includes[]': 'articles' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(tagWithArticlesSchema);
        expect(res.body).toHaveProperty('id', 1);
      });
    });
  });

  describe('/api/tags (POST)', () => {
    test('{"body":{"name":"beatae"}} - 401 error, invalid token', async () => {
      const body = {
        name: 'beatae'
      };
      const res = await request(app.getHttpServer())
        .post('/api/tags')
        .send(body);
      expect(res.status).toEqual(401);
      expect(res.body).toEqual({
        statusCode: 401,
        message: 'Invalid token',
        error: 'Unauthorized'
      });
    });

    test('{"body":{"name":"beatae"}} - success', async () => {
      const body = {
        name: 'beatae'
      };
      const res = await request(app.getHttpServer())
        .post('/api/tags')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(201);
      expect(res.body).toMatchSchema(tagSchema);
      expect(res.body).toMatchObject({
        id: 6,
        name: 'beatae'
      });
    });
  });

  describe('/api/tags/:id (PUT)', () => {
    test('{"params":{"id":6},"body":{"name":"labore}} - 401 error, invalid token', async () => {
      const body = {
        name: 'labore'
      };
      const res = await request(app.getHttpServer())
        .put('/api/tags/6')
        .send(body);
      expect(res.status).toEqual(401);
      expect(res.body).toEqual({
        statusCode: 401,
        message: 'Invalid token',
        error: 'Unauthorized'
      });
    });

    test('{"params":{"id":"a"},"body":{"name":"labore"}} - 400 error, id param must be a number', async () => {
      const body = {
        name: 'labore'
      };
      const res = await request(app.getHttpServer())
        .put('/api/tags/a')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
        error: 'Bad Request'
      });
    });

    test('{"params":{"id":100},"body":{"name":"labore"}} - 404 error, entity not found', async () => {
      const body = {
        name: 'labore'
      };
      const res = await request(app.getHttpServer())
        .put('/api/tags/100')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(404);
      expect(res.body).toEqual({
        statusCode: 404,
        message: 'Not Found'
      });
    });

    test('{"params":{"id":6},"body":{"name":"labore}} - success', async () => {
      const body = {
        name: 'labore'
      };
      const res = await request(app.getHttpServer())
        .put('/api/tags/6')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(200);
      expect(res.body).toMatchSchema(tagSchema);
      expect(res.body).toMatchObject({
        id: 6,
        name: 'labore'
      });
    });
  });

  describe('/api/tags/:id (DELETE)', () => {
    test('{"params":{"id":6}} - 401 error, invalid token', async () => {
      const res = await request(app.getHttpServer()).delete('/api/tags/6');
      expect(res.status).toEqual(401);
      expect(res.body).toEqual({
        statusCode: 401,
        message: 'Invalid token',
        error: 'Unauthorized'
      });
    });

    test('{"params":{"id":"a"}} - 400 error, id param must be a number', async () => {
      const res = await request(app.getHttpServer())
        .delete('/api/tags/a')
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
        .delete('/api/tags/100')
        .set('Authorization', authorization);
      expect(res.status).toEqual(404);
      expect(res.body).toEqual({
        statusCode: 404,
        message: 'Not Found'
      });
    });

    test('{"params":{"id":6}} - success', async () => {
      const res = await request(app.getHttpServer())
        .delete('/api/tags/6')
        .set('Authorization', authorization);
      expect(res.status).toEqual(204);
      expect(res.body).toEqual({});
    });
  });

  afterAll(() => TestAppManager.close());
});
