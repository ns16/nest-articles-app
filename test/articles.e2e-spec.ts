import { INestApplication } from '@nestjs/common';
import { matchers } from 'jest-json-schema';
import * as request from 'supertest';

import MigrationsManager from '../src/common/migration/migrations-manager';
import SeedsManager from '../src/common/seed/seeds-manager';

import {
  articleSchema,
  articlesListSchema,
  articleWithUserSchema,
  articlesWithUserListSchema,
  articleWithContentSchema,
  articlesWithContentListSchema,
  articleWithTagsSchema,
  articlesWithTagsListSchema,
  paginationSchema
} from './_tools/schemas';
import TestAppManager from './_tools/test-app-manager';

expect.extend(matchers);

describe('ArticlesController (e2e)', () => {
  let app: INestApplication;
  let authorization: string;

  beforeAll(async () => {
    await MigrationsManager.run();
    await SeedsManager.run();
    app = await TestAppManager.init();
    authorization = await TestAppManager.getAuthorization();
  });

  describe('/api/articles (GET)', () => {
    test('{"query":{}} - 401 error, invalid token', async () => {
      const res = await request(app.getHttpServer()).get('/api/articles').query({});
      expect(res.status).toEqual(401);
      expect(res.body).toEqual({
        statusCode: 401,
        message: 'Invalid token',
        error: 'Unauthorized'
      });
    });

    test('{"query":{"foo":"bar"}} - 400 error, invalid query parameter', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/articles')
        .query({ foo: 'bar' })
        .set('Authorization', authorization);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        statusCode: 400,
        message: ['property foo should not exist'],
        error: 'Bad Request'
      });
    });

    test('{"query":{}} - success', async () => {
      const res = await request(app.getHttpServer()).get('/api/articles').query({}).set('Authorization', authorization);
      expect(res.status).toEqual(200);
      expect(res.body.data).toMatchSchema(articlesListSchema);
      expect(res.body.data).toHaveLength(10);
      expect(res.body.pagination).toMatchSchema(paginationSchema);
      expect(res.body.pagination).toMatchObject({
        page: 1,
        pageSize: 10,
        rowCount: 20,
        pageCount: 2
      });
    });

    describe('paging', () => {
      test('{"query":{"page":1}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles')
          .query({ page: 1 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(articlesListSchema);
        expect(res.body.data).toHaveLength(10);
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 20,
          pageCount: 2
        });
      });

      test('{"query":{"page":2}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles')
          .query({ page: 2 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(articlesListSchema);
        expect(res.body.data).toHaveLength(10);
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 2,
          pageSize: 10,
          rowCount: 20,
          pageCount: 2
        });
      });

      test('{"query":{"page":3}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles')
          .query({ page: 3 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(articlesListSchema);
        expect(res.body.data).toHaveLength(0);
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 3,
          pageSize: 10,
          rowCount: 20,
          pageCount: 2
        });
      });

      test('{"query":{"pageSize":20}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles')
          .query({ pageSize: 20 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(articlesListSchema);
        expect(res.body.data).toHaveLength(20);
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 20,
          rowCount: 20,
          pageCount: 1
        });
      });

      test('{"query":{"pageSize":30}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles')
          .query({ pageSize: 30 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(articlesListSchema);
        expect(res.body.data).toHaveLength(20);
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 30,
          rowCount: 20,
          pageCount: 1
        });
      });
    });

    describe('sorts', () => {
      test('{"query":{"sorts[id]":"asc"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles')
          .query({ 'sorts[id]': 'asc' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(articlesListSchema);
        expect(res.body.data).toHaveLength(10);
        expect(res.body.data).toHaveProperty('[0].id', 1);
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 20,
          pageCount: 2
        });
      });

      test('{"query":{"sorts[id]":"desc"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles')
          .query({ 'sorts[id]': 'desc' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(articlesListSchema);
        expect(res.body.data).toHaveLength(10);
        expect(res.body.data).toHaveProperty('[0].id', 20);
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 20,
          pageCount: 2
        });
      });

      test('{"query":{"sorts[title]":"asc"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles')
          .query({ 'sorts[title]': 'asc' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(articlesListSchema);
        expect(res.body.data).toHaveLength(10);
        expect(res.body.data).toHaveProperty('[0].title', 'adipisci ducimus occaecati');
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 20,
          pageCount: 2
        });
      });

      test('{"query":{"sorts[title]":"desc"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles')
          .query({ 'sorts[title]': 'desc' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(articlesListSchema);
        expect(res.body.data).toHaveLength(10);
        expect(res.body.data).toHaveProperty('[0].title', 'voluptatum necessitatibus totam');
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 20,
          pageCount: 2
        });
      });
    });

    describe('includes', () => {
      test('{"query":{"includes":["foo"]}} - 400 error, invalid include value', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles')
          .query({ 'includes[]': 'foo' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          statusCode: 400,
          message: ['each value in includes must be one of the following values: user, content, tags'],
          error: 'Bad Request'
        });
      });

      test('{"query":{"includes":["user"]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles')
          .query({ 'includes[]': 'user' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(articlesWithUserListSchema);
        expect(res.body.data).toHaveLength(10);
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 20,
          pageCount: 2
        });
      });

      test('{"query":{"includes":["content"]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles')
          .query({ 'includes[]': 'content' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(articlesWithContentListSchema);
        expect(res.body.data).toHaveLength(10);
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 20,
          pageCount: 2
        });
      });

      test('{"query":{"includes":["tags"]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles')
          .query({ 'includes[]': 'tags' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(articlesWithTagsListSchema);
        expect(res.body.data).toHaveLength(10);
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 20,
          pageCount: 2
        });
      });
    });

    describe('filters', () => {
      test('{"query":{"filters[id][foo]":15}} - 400 error, invalid filter operator', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles')
          .query({ 'filters[id][foo]': 5 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          statusCode: 400,
          message: ['filters.id.property foo should not exist'],
          error: 'Bad Request'
        });
      });

      test('{"query":{"filters[id][$gt]":15}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles')
          .query({ 'filters[id][$gt]': 15 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(articlesListSchema);
        expect(res.body.data).toHaveLength(5);
        res.body.data.forEach(item => expect(item.id).toBeGreaterThan(15));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        });
      });

      test('{"query":{"filters[id][$gte]":15}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles')
          .query({ 'filters[id][$gte]': 15 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(articlesListSchema);
        expect(res.body.data).toHaveLength(6);
        res.body.data.forEach(item => expect(item.id).toBeGreaterThanOrEqual(15));
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
          .get('/api/articles')
          .query({ 'filters[id][$lt]': 6 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(articlesListSchema);
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
          .get('/api/articles')
          .query({ 'filters[id][$lte]': 6 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(articlesListSchema);
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

      test('{"query":{"filters[id][$gte]":17,"filters[id][$lte]":4}} - success, only last filter', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles')
          .query({
            'filters[id][$gte]': 17,
            'filters[id][$lte]': 4
          })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(articlesListSchema);
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

      test('{"query":{"filters[id][$lte]":4,"filters[id][$gte]":17}} - success, only last filter', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles')
          .query({
            'filters[id][$lte]': 4,
            'filters[id][$gte]': 17
          })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(articlesListSchema);
        expect(res.body.data).toHaveLength(4);
        res.body.data.forEach(item => expect(item.id).toBeGreaterThanOrEqual(17));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 4,
          pageCount: 1
        });
      });

      test('{"query":{"filters[id][$eq]":10}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles')
          .query({ 'filters[id][$eq]': 10 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(articlesListSchema);
        expect(res.body.data).toHaveLength(1);
        res.body.data.forEach(item => expect(item.id).toEqual(10));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 1,
          pageCount: 1
        });
      });

      test('{"query":{"filters[id][$ne]":10}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles')
          .query({ 'filters[id][$ne]': 10 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(articlesListSchema);
        expect(res.body.data).toHaveLength(10);
        res.body.data.forEach(item => expect(item.id).not.toEqual(10));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 19,
          pageCount: 2
        });
      });

      test('{"query":{"filters[id][$between]":[8,13]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles')
          .query({ 'filters[id][$between]': [8, 13] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(articlesListSchema);
        expect(res.body.data).toHaveLength(6);
        res.body.data.forEach(item => expect(item.id >= 8 && item.id <= 13).toBeTruthy());
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 6,
          pageCount: 1
        });
      });

      test('{"query":{"filters[id][$notBetween]":[8,13]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles')
          .query({ 'filters[id][$notBetween]': [8, 13] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(articlesListSchema);
        expect(res.body.data).toHaveLength(10);
        res.body.data.forEach(item => expect(item.id >= 8 && item.id <= 13).not.toBeTruthy());
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 14,
          pageCount: 2
        });
      });

      test('{"query":{"filters[id][$in]":[2,10,18]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles')
          .query({ 'filters[id][$in]': [2, 10, 18] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(articlesListSchema);
        expect(res.body.data).toHaveLength(3);
        res.body.data.forEach(item => expect([2, 10, 18].includes(item.id)).toBeTruthy());
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 3,
          pageCount: 1
        });
      });

      test('{"query":{"filters[id][$notIn]":[2,10,18]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles')
          .query({ 'filters[id][$notIn]': [2, 10, 18] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(articlesListSchema);
        expect(res.body.data).toHaveLength(10);
        res.body.data.forEach(item => expect([2, 10, 18].includes(item.id)).not.toBeTruthy());
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 17,
          pageCount: 2
        });
      });

      test('{"query":{"filters[title][foo]":"sint repellendus inventore"}} - 400 error, invalid filter operator', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles')
          .query({ 'filters[title][foo]': 'sint repellendus inventore' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          statusCode: 400,
          message: ['filters.title.property foo should not exist'],
          error: 'Bad Request'
        });
      });

      test('{"query":{"filters[title][$eq]":"sint repellendus inventore"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles')
          .query({ 'filters[title][$eq]': 'sint repellendus inventore' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(articlesListSchema);
        expect(res.body.data).toHaveLength(1);
        res.body.data.forEach(item => expect(item.title).toEqual('sint repellendus inventore'));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 1,
          pageCount: 1
        });
      });

      test('{"query":{"filters[title][$ne]":"sint repellendus inventore"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles')
          .query({ 'filters[title][$ne]': 'sint repellendus inventore' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(articlesListSchema);
        expect(res.body.data).toHaveLength(10);
        res.body.data.forEach(item => expect(item.title).not.toEqual('sint repellendus inventore'));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 19,
          pageCount: 2
        });
      });

      test('{"query":{"filters[title][$in]":["sint repellendus inventore","facere ea odit"]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles')
          .query({ 'filters[title][$in]': ['sint repellendus inventore', 'facere ea odit'] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(articlesListSchema);
        expect(res.body.data).toHaveLength(2);
        res.body.data.forEach(item => expect(['sint repellendus inventore', 'facere ea odit'].includes(item.title)).toBeTruthy());
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 2,
          pageCount: 1
        });
      });

      test('{"query":{"filters[title][$notIn]":["sint repellendus inventore","facere ea odit"]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles')
          .query({ 'filters[title][$notIn]': ['sint repellendus inventore', 'facere ea odit'] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(articlesListSchema);
        expect(res.body.data).toHaveLength(10);
        res.body.data.forEach(item => expect(['sint repellendus inventore', 'facere ea odit'].includes(item.title)).not.toBeTruthy());
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 18,
          pageCount: 2
        });
      });

      test('{"query":{"filters[title][$like]":"a"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles')
          .query({ 'filters[title][$like]': 'a' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(articlesListSchema);
        expect(res.body.data).toHaveLength(10);
        res.body.data.forEach(item => expect(item.title).toMatch('a'));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 15,
          pageCount: 2
        });
      });

      test('{"query":{"filters[title][$notLike]":"a"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles')
          .query({ 'filters[title][$notLike]': 'a' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(articlesListSchema);
        expect(res.body.data).toHaveLength(5);
        res.body.data.forEach(item => expect(item.title).not.toMatch('a'));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        });
      });

      test('{"query":{"filters[title][$like]":"b","filters[title][$notLike]":"b"}} - success, only last filter', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles')
          .query({
            'filters[title][$like]': 'b',
            'filters[title][$notLike]': 'b'
          })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(articlesListSchema);
        expect(res.body.data).toHaveLength(10);
        res.body.data.forEach(item => expect(item.title).not.toMatch('b'));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 15,
          pageCount: 2
        });
      });

      test('{"query":{"filters[title][$notLike]":"b","filters[title][$like]":"b"}} - success, only last filter', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles')
          .query({
            'filters[title][$notLike]': 'b',
            'filters[title][$like]': 'b'
          })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(articlesListSchema);
        expect(res.body.data).toHaveLength(5);
        res.body.data.forEach(item => expect(item.title).toMatch('b'));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        });
      });
    });
  });

  describe('/api/articles/all (GET)', () => {
    test('{"query":{}} - 401 error, invalid token', async () => {
      const res = await request(app.getHttpServer()).get('/api/articles/all').query({});
      expect(res.status).toEqual(401);
      expect(res.body).toEqual({
        statusCode: 401,
        message: 'Invalid token',
        error: 'Unauthorized'
      });
    });

    test('{"query":{"foo":"bar"}} - 400 error, invalid query parameter', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/articles/all')
        .query({ foo: 'bar' })
        .set('Authorization', authorization);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        statusCode: 400,
        message: ['property foo should not exist'],
        error: 'Bad Request'
      });
    });

    test('{"query":{}} - success', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/articles/all')
        .query({})
        .set('Authorization', authorization);
      expect(res.status).toEqual(200);
      expect(res.body).toMatchSchema(articlesListSchema);
      expect(res.body).toHaveLength(20);
    });

    describe('sorts', () => {
      test('{"query":{"sorts[id]":"asc"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles/all')
          .query({ 'sorts[id]': 'asc' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(articlesListSchema);
        expect(res.body).toHaveLength(20);
        expect(res.body).toHaveProperty('[0].id', 1);
      });

      test('{"query":{"sorts[id]":"desc"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles/all')
          .query({ 'sorts[id]': 'desc' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(articlesListSchema);
        expect(res.body).toHaveLength(20);
        expect(res.body).toHaveProperty('[0].id', 20);
      });

      test('{"query":{"sorts[title]":"asc"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles/all')
          .query({ 'sorts[title]': 'asc' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(articlesListSchema);
        expect(res.body).toHaveLength(20);
        expect(res.body).toHaveProperty('[0].title', 'adipisci ducimus occaecati');
      });

      test('{"query":{"sorts[title]":"desc"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles/all')
          .query({ 'sorts[title]': 'desc' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(articlesListSchema);
        expect(res.body).toHaveLength(20);
        expect(res.body).toHaveProperty('[0].title', 'voluptatum necessitatibus totam');
      });
    });

    describe('includes', () => {
      test('{"query":{"includes":["foo"]}} - 400 error, invalid include value', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles/all')
          .query({ 'includes[]': 'foo' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          statusCode: 400,
          message: ['each value in includes must be one of the following values: user, content, tags'],
          error: 'Bad Request'
        });
      });

      test('{"query":{"includes":["user"]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles/all')
          .query({ 'includes[]': 'user' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(articlesWithUserListSchema);
        expect(res.body).toHaveLength(20);
      });

      test('{"query":{"includes":["content"]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles/all')
          .query({ 'includes[]': 'content' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(articlesWithContentListSchema);
        expect(res.body).toHaveLength(20);
      });

      test('{"query":{"includes":["tags"]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles/all')
          .query({ 'includes[]': 'tags' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(articlesWithTagsListSchema);
        expect(res.body).toHaveLength(20);
      });
    });

    describe('filters', () => {
      test('{"query":{"filters[id][foo]":15}} - 400 error, invalid filter operator', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles/all')
          .query({ 'filters[id][foo]': 15 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          statusCode: 400,
          message: ['filters.id.property foo should not exist'],
          error: 'Bad Request'
        });
      });

      test('{"query":{"filters[id][$gt]":15}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles/all')
          .query({ 'filters[id][$gt]': 15 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(articlesListSchema);
        expect(res.body).toHaveLength(5);
        res.body.forEach(item => expect(item.id).toBeGreaterThan(15));
      });

      test('{"query":{"filters[id][$gte]":15}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles/all')
          .query({ 'filters[id][$gte]': 15 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(articlesListSchema);
        expect(res.body).toHaveLength(6);
        res.body.forEach(item => expect(item.id).toBeGreaterThanOrEqual(15));
      });

      test('{"query":{"filters[id][$lt]":6}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles/all')
          .query({ 'filters[id][$lt]': 6 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(articlesListSchema);
        expect(res.body).toHaveLength(5);
        res.body.forEach(item => expect(item.id).toBeLessThan(6));
      });

      test('{"query":{"filters[id][$lte]":6}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles/all')
          .query({ 'filters[id][$lte]': 6 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(articlesListSchema);
        expect(res.body).toHaveLength(6);
        res.body.forEach(item => expect(item.id).toBeLessThanOrEqual(6));
      });

      test('{"query":{"filters[id][$gte]":17,"filters[id][$lte]":4}} - success, only last filter', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles/all')
          .query({
            'filters[id][$gte]': 17,
            'filters[id][$lte]': 4
          })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(articlesListSchema);
        expect(res.body).toHaveLength(4);
        res.body.forEach(item => expect(item.id).toBeLessThanOrEqual(4));
      });

      test('{"query":{"filters[id][$lte]":4,"filters[id][$gte]":17}} - success, only last filter', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles/all')
          .query({
            'filters[id][$lte]': 4,
            'filters[id][$gte]': 17
          })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(articlesListSchema);
        expect(res.body).toHaveLength(4);
        res.body.forEach(item => expect(item.id).toBeGreaterThanOrEqual(17));
      });

      test('{"query":{"filters[id][$eq]":10}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles/all')
          .query({ 'filters[id][$eq]': 10 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(articlesListSchema);
        expect(res.body).toHaveLength(1);
        res.body.forEach(item => expect(item.id).toEqual(10));
      });

      test('{"query":{"filters[id][$ne]":10}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles/all')
          .query({ 'filters[id][$ne]': 10 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(articlesListSchema);
        expect(res.body).toHaveLength(19);
        res.body.forEach(item => expect(item.id).not.toEqual(10));
      });

      test('{"query":{"filters[id][$between]":[8,13]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles/all')
          .query({ 'filters[id][$between]': [8, 13] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(articlesListSchema);
        expect(res.body).toHaveLength(6);
        res.body.forEach(item => expect(item.id >= 8 && item.id <= 13).toBeTruthy());
      });

      test('{"query":{"filters[id][$notBetween]":[8,13]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles/all')
          .query({ 'filters[id][$notBetween]': [8, 13] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(articlesListSchema);
        expect(res.body).toHaveLength(14);
        res.body.forEach(item => expect(item.id >= 8 && item.id <= 13).not.toBeTruthy());
      });

      test('{"query":{"filters[id][$in]":[2,10,18]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles/all')
          .query({ 'filters[id][$in]': [2, 10, 18] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(articlesListSchema);
        expect(res.body).toHaveLength(3);
        res.body.forEach(item => expect([2, 10, 18].includes(item.id)).toBeTruthy());
      });

      test('{"query":{"filters[id][$notIn]":[2,5,8]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles/all')
          .query({ 'filters[id][$notIn]': [2, 10, 18] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(articlesListSchema);
        expect(res.body).toHaveLength(17);
        res.body.forEach(item => expect([2, 10, 18].includes(item.id)).not.toBeTruthy());
      });

      test('{"query":{"filters[title][foo]":"sint repellendus inventore"}} - 400 error, invalid filter operator', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles/all')
          .query({ 'filters[title][foo]': 'sint repellendus inventore' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          statusCode: 400,
          message: ['filters.title.property foo should not exist'],
          error: 'Bad Request'
        });
      });

      test('{"query":{"filters[title][$eq]":"sint repellendus inventore"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles/all')
          .query({ 'filters[title][$eq]': 'sint repellendus inventore' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(articlesListSchema);
        expect(res.body).toHaveLength(1);
        res.body.forEach(item => expect(item.title).toEqual('sint repellendus inventore'));
      });

      test('{"query":{"filters[title][$ne]":"sint repellendus inventore"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles/all')
          .query({ 'filters[title][$ne]': 'sint repellendus inventore' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(articlesListSchema);
        expect(res.body).toHaveLength(19);
        res.body.forEach(item => expect(item.title).not.toEqual('sint repellendus inventore'));
      });

      test('{"query":{"filters[title][$in]":["sint repellendus inventore","facere ea odit"]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles/all')
          .query({ 'filters[title][$in]': ['sint repellendus inventore', 'facere ea odit'] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(articlesListSchema);
        expect(res.body).toHaveLength(2);
        res.body.forEach(item => expect(['sint repellendus inventore', 'facere ea odit'].includes(item.title)).toBeTruthy());
      });

      test('{"query":{"filters[title][$notIn]":["sint repellendus inventore","facere ea odit"]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles/all')
          .query({ 'filters[title][$notIn]': ['sint repellendus inventore', 'facere ea odit'] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(articlesListSchema);
        expect(res.body).toHaveLength(18);
        res.body.forEach(item => expect(['sint repellendus inventore', 'facere ea odit'].includes(item.title)).not.toBeTruthy());
      });

      test('{"query":{"filters[title][$like]":"a"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles/all')
          .query({ 'filters[title][$like]': 'a' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(articlesListSchema);
        expect(res.body).toHaveLength(15);
        res.body.forEach(item => expect(item.title).toMatch('a'));
      });

      test('{"query":{"filters[title][$notLike]":"a"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles/all')
          .query({ 'filters[title][$notLike]': 'a' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(articlesListSchema);
        expect(res.body).toHaveLength(5);
        res.body.forEach(item => expect(item.title).not.toMatch('a'));
      });

      test('{"query":{"filters[title][$like]":"b","filters[title][$notLike]":"b"}} - success, only last filter', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles/all')
          .query({
            'filters[title][$like]': 'b',
            'filters[title][$notLike]': 'b'
          })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(articlesListSchema);
        expect(res.body).toHaveLength(15);
        res.body.forEach(item => expect(item.title).not.toMatch('b'));
      });

      test('{"query":{"filters[title][$notLike]":"b","filters[title][$like]":"b"}} - success, only last filter', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles/all')
          .query({
            'filters[title][$notLike]': 'b',
            'filters[title][$like]': 'b'
          })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(articlesListSchema);
        expect(res.body).toHaveLength(5);
        res.body.forEach(item => expect(item.title).toMatch('b'));
      });
    });
  });

  describe('/api/articles/:id (GET)', () => {
    test('{"params":{"id":1},"query":{}} - 401 error, invalid token', async () => {
      const res = await request(app.getHttpServer()).get('/api/articles/1').query({});
      expect(res.status).toEqual(401);
      expect(res.body).toEqual({
        statusCode: 401,
        message: 'Invalid token',
        error: 'Unauthorized'
      });
    });

    test('{"params":{"id":"a"},"query":{}} - 400 error, id param must be a number', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/articles/a')
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
        .get('/api/articles/100')
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
        .get('/api/articles/1')
        .query({ foo: 'bar' })
        .set('Authorization', authorization);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        statusCode: 400,
        message: ['property foo should not exist'],
        error: 'Bad Request'
      });
    });

    test('{"params":{"id":1},"query":{}} - success', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/articles/1')
        .query({})
        .set('Authorization', authorization);
      expect(res.status).toEqual(200);
      expect(res.body).toMatchSchema(articleSchema);
      expect(res.body).toHaveProperty('id', 1);
    });

    describe('includes', () => {
      test('{"params":{"id":1},{"query":{"includes":["foo"]}} - 400 error, invalid include value', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles/1')
          .query({ 'includes[]': 'foo' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          statusCode: 400,
          message: ['each value in includes must be one of the following values: user, content, tags'],
          error: 'Bad Request'
        });
      });

      test('{"params":{"id":1},{"query":{"includes":["user"]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles/1')
          .query({ 'includes[]': 'user' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(articleWithUserSchema);
        expect(res.body).toHaveProperty('id', 1);
      });

      test('{"params":{"id":1},{"query":{"includes":["content"]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles/1')
          .query({ 'includes[]': 'content' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(articleWithContentSchema);
        expect(res.body).toHaveProperty('id', 1);
      });

      test('{"params":{"id":1},{"query":{"includes":["tags"]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/articles/1')
          .query({ 'includes[]': 'tags' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(articleWithTagsSchema);
        expect(res.body).toHaveProperty('id', 1);
      });
    });
  });

  describe('/api/articles (POST)', () => {
    test('{"body":{"user_id":1,"title":"illum beatae soluta","description":"...","status":"published"}} - 401 error, invalid token', async () => {
      const body = {
        user_id: 1,
        title: 'illum beatae soluta',
        description:
          'Vero nihil eius quidem. Quaerat ipsum rem animi fugit pariatur deleniti. Neque unde ad quam illo facere.',
        status: 'published'
      };
      const res = await request(app.getHttpServer()).post('/api/articles').send(body);
      expect(res.status).toEqual(401);
      expect(res.body).toEqual({
        statusCode: 401,
        message: 'Invalid token',
        error: 'Unauthorized'
      });
    });

    test('{"body":{"user_id":100,"title":"illum beatae soluta","description":"...","status":"published"}} - 400 error, user_id field must contain id of existing User', async () => {
      const body = {
        user_id: 100,
        title: 'illum beatae soluta',
        description:
          'Vero nihil eius quidem. Quaerat ipsum rem animi fugit pariatur deleniti. Neque unde ad quam illo facere.',
        status: 'published'
      };
      const res = await request(app.getHttpServer())
        .post('/api/articles')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        statusCode: 400,
        message: ['user_id field must contain id of existing User'],
        error: 'Bad Request'
      });
    });

    test('{"body":{"user_id":1,"title":"illum beatae soluta","description":"...","status":"published"}} - success', async () => {
      const body = {
        user_id: 1,
        title: 'illum beatae soluta',
        description:
          'Vero nihil eius quidem. Quaerat ipsum rem animi fugit pariatur deleniti. Neque unde ad quam illo facere.',
        status: 'published'
      };
      const res = await request(app.getHttpServer())
        .post('/api/articles')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(201);
      expect(res.body).toMatchSchema(articleSchema);
      expect(res.body).toMatchObject({
        id: 21,
        user_id: 1,
        title: 'illum beatae soluta',
        description:
          'Vero nihil eius quidem. Quaerat ipsum rem animi fugit pariatur deleniti. Neque unde ad quam illo facere.',
        status: 'published'
      });
    });
  });

  describe('/api/articles/:id (PUT)', () => {
    test('{"params":{"id":21},"body":{"user_id":1,"title":"illum beatae cumque","description":"...","status":"published"}} - 401 error, invalid token', async () => {
      const body = {
        user_id: 1,
        title: 'illum beatae cumque',
        description:
          'Vero nihil eius quidem. Quaerat ipsum rem animi fugit pariatur deleniti. Neque unde ad quam illo facere.',
        status: 'published'
      };
      const res = await request(app.getHttpServer()).put('/api/articles/21').send(body);
      expect(res.status).toEqual(401);
      expect(res.body).toEqual({
        statusCode: 401,
        message: 'Invalid token',
        error: 'Unauthorized'
      });
    });

    test('{"params":{"id":"a"},"body":{"user_id":1,"title":"illum beatae cumque","description":"...","status":"published"}} - 400 error, id param must be a number', async () => {
      const body = {
        user_id: 1,
        title: 'illum beatae cumque',
        description:
          'Vero nihil eius quidem. Quaerat ipsum rem animi fugit pariatur deleniti. Neque unde ad quam illo facere.',
        status: 'published'
      };
      const res = await request(app.getHttpServer())
        .put('/api/articles/a')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
        error: 'Bad Request'
      });
    });

    test('{"params":{"id":100},"body":{"user_id":1,"title":"illum beatae cumque","description":"...","status":"published"}} - 404 error, entity not found', async () => {
      const body = {
        user_id: 1,
        title: 'illum beatae cumque',
        description:
          'Vero nihil eius quidem. Quaerat ipsum rem animi fugit pariatur deleniti. Neque unde ad quam illo facere.',
        status: 'published'
      };
      const res = await request(app.getHttpServer())
        .put('/api/articles/100')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(404);
      expect(res.body).toEqual({
        statusCode: 404,
        message: 'Not Found'
      });
    });

    test('{"params":{"id":21},"body":{"user_id":100,"title":"illum beatae cumque","description":"...","status":"published"}} - 400 error, user_id field must contain id of existing User', async () => {
      const body = {
        user_id: 100,
        title: 'illum beatae cumque',
        description:
          'Vero nihil eius quidem. Quaerat ipsum rem animi fugit pariatur deleniti. Neque unde ad quam illo facere.',
        status: 'published'
      };
      const res = await request(app.getHttpServer())
        .put('/api/articles/21')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        statusCode: 400,
        message: ['user_id field must contain id of existing User'],
        error: 'Bad Request'
      });
    });

    test('{"params":{"id":21},"body":{"user_id":1,"title":"illum beatae cumque","description":"...","status":"published"}} - success', async () => {
      const body = {
        user_id: 1,
        title: 'illum beatae cumque',
        description:
          'Vero nihil eius quidem. Quaerat ipsum rem animi fugit pariatur deleniti. Neque unde ad quam illo facere.',
        status: 'published'
      };
      const res = await request(app.getHttpServer())
        .put('/api/articles/21')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(200);
      expect(res.body).toMatchSchema(articleSchema);
      expect(res.body).toMatchObject({
        id: 21,
        user_id: 1,
        title: 'illum beatae cumque',
        description:
          'Vero nihil eius quidem. Quaerat ipsum rem animi fugit pariatur deleniti. Neque unde ad quam illo facere.',
        status: 'published'
      });
    });
  });

  describe('/api/articles/:id (DELETE)', () => {
    test('{"params":{"id":21}} - 401 error, invalid token', async () => {
      const res = await request(app.getHttpServer()).delete('/api/articles/21');
      expect(res.status).toEqual(401);
      expect(res.body).toEqual({
        statusCode: 401,
        message: 'Invalid token',
        error: 'Unauthorized'
      });
    });

    test('{"params":{"id":"a"}} - 400 error, id param must be a number', async () => {
      const res = await request(app.getHttpServer()).delete('/api/articles/a').set('Authorization', authorization);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
        error: 'Bad Request'
      });
    });

    test('{"params":{"id":100}} - 404 error, entity not found', async () => {
      const res = await request(app.getHttpServer()).delete('/api/articles/100').set('Authorization', authorization);
      expect(res.status).toEqual(404);
      expect(res.body).toEqual({
        statusCode: 404,
        message: 'Not Found'
      });
    });

    test('{"params":{"id":21}} - success', async () => {
      const res = await request(app.getHttpServer()).delete('/api/articles/21').set('Authorization', authorization);
      expect(res.status).toEqual(204);
      expect(res.body).toEqual({});
    });
  });

  afterAll(() => TestAppManager.close());
});
