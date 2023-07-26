import { INestApplication } from '@nestjs/common';
import { matchers } from 'jest-json-schema';
import * as request from 'supertest';
import MigrationsManager from '../src/common/migration/migrations-manager';
import SeedsManager from '../src/common/seed/seeds-manager';
import {
  contentSchema,
  contentsListSchema,
  contentWithArticleSchema,
  contentsWithArticleListSchema,
  paginationSchema
} from './_tools/schemas';
import TestAppManager from './_tools/test-app-manager';

expect.extend(matchers);

describe('ContentsController (e2e)', () => {

  let app: INestApplication;
  let authorization: string;

  beforeAll(async () => {
    await MigrationsManager.run();
    await SeedsManager.run();
    app = await TestAppManager.init();
    authorization = await TestAppManager.getAuthorization();
  });

  describe('/api/contents (GET)', () => {
    test('{"query":{}} - 401 error, invalid token', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/contents')
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
        .get('/api/contents')
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
        .get('/api/contents')
        .query({})
        .set('Authorization', authorization);
      expect(res.status).toEqual(200);
      expect(res.body.data).toMatchSchema(contentsListSchema);
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
          .get('/api/contents')
          .query({ page: 1 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(contentsListSchema);
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
          .get('/api/contents')
          .query({ page: 2 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(contentsListSchema);
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
          .get('/api/contents')
          .query({ page: 3 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(contentsListSchema);
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
          .get('/api/contents')
          .query({ pageSize: 20 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(contentsListSchema);
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
          .get('/api/contents')
          .query({ pageSize: 30 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(contentsListSchema);
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
          .get('/api/contents')
          .query({ 'sorts[id]': 'asc' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(contentsListSchema);
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
          .get('/api/contents')
          .query({ 'sorts[id]': 'desc' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(contentsListSchema);
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

      test('{"query":{"sorts[body]":"asc"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents')
          .query({ 'sorts[body]': 'asc' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(contentsListSchema);
        expect(res.body.data).toHaveLength(10);
        expect(res.body.data).toHaveProperty('[0].body', 'Ab eum hic occaecati nisi magnam. Iusto inventore vero ea laborum libero exercitationem nam. Repudiandae nobis quis aspernatur.\n' +
          'Corporis libero autem odio in hic nostrum. Inventore molestias dicta molestias esse. Officiis optio inventore vero tempore error quasi aperiam earum tenetur.\n' +
          'Quae temporibus totam et molestias quas incidunt. Harum incidunt quo veniam aliquam neque ab ab possimus expedita. Quaerat non quod tempore.');
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 20,
          pageCount: 2
        });
      });

      test('{"query":{"sorts[body]":"desc"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents')
          .query({ 'sorts[body]': 'desc' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(contentsListSchema);
        expect(res.body.data).toHaveLength(10);
        expect(res.body.data).toHaveProperty('[0].body', 'Voluptas exercitationem officia nisi. Quis quidem dicta molestias necessitatibus ullam soluta saepe voluptatibus. Quas similique qui.\n' +
          'Occaecati ad ducimus quis non sapiente officia. Nisi iure eveniet fuga officiis earum praesentium. Reprehenderit ipsum eaque autem facere ex quaerat.\n' +
          'Soluta soluta ullam sapiente corporis earum numquam corrupti voluptatum accusantium. Illum iure exercitationem optio deleniti perferendis ducimus perspiciatis repudiandae dicta. Cum repellendus laboriosam provident optio temporibus dignissimos voluptas.');
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
          .get('/api/contents')
          .query({ 'includes[]': 'foo' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          statusCode: 400,
          message: [
            'each value in includes must be one of the following values: article'
          ],
          error: 'Bad Request'
        });
      });

      test('{"query":{"includes":["article"]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents')
          .query({ 'includes[]': 'article' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(contentsWithArticleListSchema);
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
          .get('/api/contents')
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

      test('{"query":{"filters[id][$gt]":15}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents')
          .query({ 'filters[id][$gt]': 15 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(contentsListSchema);
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
          .get('/api/contents')
          .query({ 'filters[id][$gte]': 15 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(contentsListSchema);
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
          .get('/api/contents')
          .query({ 'filters[id][$lt]': 6 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(contentsListSchema);
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
          .get('/api/contents')
          .query({ 'filters[id][$lte]': 6 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(contentsListSchema);
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
          .get('/api/contents')
          .query({
            'filters[id][$gte]': 17,
            'filters[id][$lte]': 4
          })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(contentsListSchema);
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
          .get('/api/contents')
          .query({
            'filters[id][$lte]': 4,
            'filters[id][$gte]': 17
          })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(contentsListSchema);
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
          .get('/api/contents')
          .query({ 'filters[id][$eq]': 10 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(contentsListSchema);
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
          .get('/api/contents')
          .query({ 'filters[id][$ne]': 10 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(contentsListSchema);
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
          .get('/api/contents')
          .query({ 'filters[id][$between]': [8, 13] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(contentsListSchema);
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
          .get('/api/contents')
          .query({ 'filters[id][$notBetween]': [8, 13] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(contentsListSchema);
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
          .get('/api/contents')
          .query({ 'filters[id][$in]': [2, 10, 18] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(contentsListSchema);
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
          .get('/api/contents')
          .query({ 'filters[id][$notIn]': [2, 10, 18] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(contentsListSchema);
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

      test('{"query":{"filters[body][foo]":"..."}} - 400 error, invalid filter operator', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents')
          .query({ 'filters[body][foo]': 'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
              'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
              'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          statusCode: 400,
          message: [
            'filters.body.property foo should not exist'
          ],
          error: 'Bad Request'
        });
      });

      test('{"query":{"filters[body][$eq]":"..."}} - 400 error, invalid filter value', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents')
          .query({ 'filters[body][$eq]': 'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
              'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
              'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          statusCode: 400,
          message: [
            'filters.body.$eq must be shorter than or equal to 100 characters'
          ],
          error: 'Bad Request'
        });
      });

      test('{"query":{"filters[body][$ne]":"..."}} - 400 error, invalid filter value', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents')
          .query({ 'filters[body][$ne]': 'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
              'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
              'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          statusCode: 400,
          message: [
            'filters.body.$ne must be shorter than or equal to 100 characters'
          ],
          error: 'Bad Request'
        });
      });

      test('{"query":{"filters[body][$in]":["...","..."]}} - 400 error, invalid filter value', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents')
          .query({ 'filters[body][$in]': [
            'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
            'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
            'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.',
            'Voluptas exercitationem officia nisi. Quis quidem dicta molestias necessitatibus ullam soluta saepe voluptatibus. Quas similique qui.\n' +
            'Occaecati ad ducimus quis non sapiente officia. Nisi iure eveniet fuga officiis earum praesentium. Reprehenderit ipsum eaque autem facere ex quaerat.\n' +
            'Soluta soluta ullam sapiente corporis earum numquam corrupti voluptatum accusantium. Illum iure exercitationem optio deleniti perferendis ducimus perspiciatis repudiandae dicta. Cum repellendus laboriosam provident optio temporibus dignissimos voluptas.'
          ] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          statusCode: 400,
          message: [
            'filters.body.each value in $in must be shorter than or equal to 100 characters'
          ],
          error: 'Bad Request'
        });
      });

      test('{"query":{"filters[body][$notIn]":["...","..."]}} - 400 error, invalid filter value', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents')
          .query({ 'filters[body][$notIn]': [
            'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
            'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
            'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.',
            'Voluptas exercitationem officia nisi. Quis quidem dicta molestias necessitatibus ullam soluta saepe voluptatibus. Quas similique qui.\n' +
            'Occaecati ad ducimus quis non sapiente officia. Nisi iure eveniet fuga officiis earum praesentium. Reprehenderit ipsum eaque autem facere ex quaerat.\n' +
            'Soluta soluta ullam sapiente corporis earum numquam corrupti voluptatum accusantium. Illum iure exercitationem optio deleniti perferendis ducimus perspiciatis repudiandae dicta. Cum repellendus laboriosam provident optio temporibus dignissimos voluptas.'
          ] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          statusCode: 400,
          message: [
            'filters.body.each value in $notIn must be shorter than or equal to 100 characters'
          ],
          error: 'Bad Request'
        });
      });

      test('{"query":{"filters[body][$like]":"ab"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents')
          .query({ 'filters[body][$like]': 'ab' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(contentsListSchema);
        expect(res.body.data).toHaveLength(10);
        res.body.data.forEach(item => expect(item.body).toMatch('ab'));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 15,
          pageCount: 2
        });
      });

      test('{"query":{"filters[body][$notLike]":"ab"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents')
          .query({ 'filters[body][$notLike]': 'ab' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(contentsListSchema);
        expect(res.body.data).toHaveLength(5);
        res.body.data.forEach(item => expect(item.body).not.toMatch('ab'));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        });
      });

      test('{"query":{"filters[body][$like]":"ab","filters[body][$notLike]":"ab"}} - success, only last filter', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents')
          .query({
            'filters[body][$like]': 'ab',
            'filters[body][$notLike]': 'ab'
          })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(contentsListSchema);
        expect(res.body.data).toHaveLength(5);
        res.body.data.forEach(item => expect(item.body).not.toMatch('ab'));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        });
      });

      test('{"query":{"filters[body][$notLike]":"ab","filters[body][$like]":"ab"}} - success, only last filter', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents')
          .query({
            'filters[body][$notLike]': 'ab',
            'filters[body][$like]': 'ab'
          })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body.data).toMatchSchema(contentsListSchema);
        expect(res.body.data).toHaveLength(10);
        res.body.data.forEach(item => expect(item.body).toMatch('ab'));
        expect(res.body.pagination).toMatchSchema(paginationSchema);
        expect(res.body.pagination).toMatchObject({
          page: 1,
          pageSize: 10,
          rowCount: 15,
          pageCount: 2
        });
      });
    });
  });

  describe('/api/contents/all (GET)', () => {
    test('{"query":{}} - 401 error, invalid token', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/contents/all')
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
        .get('/api/contents/all')
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
        .get('/api/contents/all')
        .query({})
        .set('Authorization', authorization);
      expect(res.status).toEqual(200);
      expect(res.body).toMatchSchema(contentsListSchema);
      expect(res.body).toHaveLength(20);
    });

    describe('sorts', () => {
      test('{"query":{"sorts[id]":"asc"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents/all')
          .query({ 'sorts[id]': 'asc' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(contentsListSchema);
        expect(res.body).toHaveLength(20);
        expect(res.body).toHaveProperty('[0].id', 1);
      });

      test('{"query":{"sorts[id]":"desc"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents/all')
          .query({ 'sorts[id]': 'desc' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(contentsListSchema);
        expect(res.body).toHaveLength(20);
        expect(res.body).toHaveProperty('[0].id', 20);
      });

      test('{"query":{"sorts[body]":"asc"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents/all')
          .query({ 'sorts[body]': 'asc' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(contentsListSchema);
        expect(res.body).toHaveLength(20);
        expect(res.body).toHaveProperty('[0].body', 'Ab eum hic occaecati nisi magnam. Iusto inventore vero ea laborum libero exercitationem nam. Repudiandae nobis quis aspernatur.\n' +
          'Corporis libero autem odio in hic nostrum. Inventore molestias dicta molestias esse. Officiis optio inventore vero tempore error quasi aperiam earum tenetur.\n' +
          'Quae temporibus totam et molestias quas incidunt. Harum incidunt quo veniam aliquam neque ab ab possimus expedita. Quaerat non quod tempore.');
      });

      test('{"query":{"sorts[body]":"desc"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents/all')
          .query({ 'sorts[body]': 'desc' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(contentsListSchema);
        expect(res.body).toHaveLength(20);
        expect(res.body).toHaveProperty('[0].body', 'Voluptas exercitationem officia nisi. Quis quidem dicta molestias necessitatibus ullam soluta saepe voluptatibus. Quas similique qui.\n' +
          'Occaecati ad ducimus quis non sapiente officia. Nisi iure eveniet fuga officiis earum praesentium. Reprehenderit ipsum eaque autem facere ex quaerat.\n' +
          'Soluta soluta ullam sapiente corporis earum numquam corrupti voluptatum accusantium. Illum iure exercitationem optio deleniti perferendis ducimus perspiciatis repudiandae dicta. Cum repellendus laboriosam provident optio temporibus dignissimos voluptas.');
      });
    });

    describe('includes', () => {
      test('{"query":{"includes":["foo"]}} - 400 error, invalid include value', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents/all')
          .query({ 'includes[]': 'foo' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          statusCode: 400,
          message: [
            'each value in includes must be one of the following values: article'
          ],
          error: 'Bad Request'
        });
      });

      test('{"query":{"includes":["article"]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents/all')
          .query({ 'includes[]': 'article' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(contentsWithArticleListSchema);
        expect(res.body).toHaveLength(20);
      });
    });

    describe('filters', () => {
      test('{"query":{"filters[id][foo]":15}} - 400 error, invalid filter operator', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents/all')
          .query({ 'filters[id][foo]': 15 })
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

      test('{"query":{"filters[id][$gt]":15}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents/all')
          .query({ 'filters[id][$gt]': 15 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(contentsListSchema);
        expect(res.body).toHaveLength(5);
        res.body.forEach(item => expect(item.id).toBeGreaterThan(15));
      });

      test('{"query":{"filters[id][$gte]":15}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents/all')
          .query({ 'filters[id][$gte]': 15 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(contentsListSchema);
        expect(res.body).toHaveLength(6);
        res.body.forEach(item => expect(item.id).toBeGreaterThanOrEqual(15));
      });

      test('{"query":{"filters[id][$lt]":6}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents/all')
          .query({ 'filters[id][$lt]': 6 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(contentsListSchema);
        expect(res.body).toHaveLength(5);
        res.body.forEach(item => expect(item.id).toBeLessThan(6));
      });

      test('{"query":{"filters[id][$lte]":6}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents/all')
          .query({ 'filters[id][$lte]': 6 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(contentsListSchema);
        expect(res.body).toHaveLength(6);
        res.body.forEach(item => expect(item.id).toBeLessThanOrEqual(6));
      });

      test('{"query":{"filters[id][$gte]":17,"filters[id][$lte]":4}} - success, only last filter', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents/all')
          .query({
            'filters[id][$gte]': 17,
            'filters[id][$lte]': 4
          })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(contentsListSchema);
        expect(res.body).toHaveLength(4);
        res.body.forEach(item => expect(item.id).toBeLessThanOrEqual(4));
      });

      test('{"query":{"filters[id][$lte]":4,"filters[id][$gte]":17}} - success, only last filter', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents/all')
          .query({
            'filters[id][$lte]': 4,
            'filters[id][$gte]': 17
          })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(contentsListSchema);
        expect(res.body).toHaveLength(4);
        res.body.forEach(item => expect(item.id).toBeGreaterThanOrEqual(17));
      });

      test('{"query":{"filters[id][$eq]":10}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents/all')
          .query({ 'filters[id][$eq]': 10 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(contentsListSchema);
        expect(res.body).toHaveLength(1);
        res.body.forEach(item => expect(item.id).toEqual(10));
      });

      test('{"query":{"filters[id][$ne]":10}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents/all')
          .query({ 'filters[id][$ne]': 10 })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(contentsListSchema);
        expect(res.body).toHaveLength(19);
        res.body.forEach(item => expect(item.id).not.toEqual(10));
      });

      test('{"query":{"filters[id][$between]":[8,13]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents/all')
          .query({ 'filters[id][$between]': [8, 13] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(contentsListSchema);
        expect(res.body).toHaveLength(6);
        res.body.forEach(item => expect(item.id >= 8 && item.id <= 13).toBeTruthy());
      });

      test('{"query":{"filters[id][$notBetween]":[8,13]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents/all')
          .query({ 'filters[id][$notBetween]': [8, 13] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(contentsListSchema);
        expect(res.body).toHaveLength(14);
        res.body.forEach(item => expect(item.id >= 8 && item.id <= 13).not.toBeTruthy());
      });

      test('{"query":{"filters[id][$in]":[2,10,18]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents/all')
          .query({ 'filters[id][$in]': [2, 10, 18] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(contentsListSchema);
        expect(res.body).toHaveLength(3);
        res.body.forEach(item => expect([2, 10, 18].includes(item.id)).toBeTruthy());
      });

      test('{"query":{"filters[id][$notIn]":[2,5,8]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents/all')
          .query({ 'filters[id][$notIn]': [2, 10, 18] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(contentsListSchema);
        expect(res.body).toHaveLength(17);
        res.body.forEach(item => expect([2, 10, 18].includes(item.id)).not.toBeTruthy());
      });

      test('{"query":{"filters[body][foo]":"..."}} - 400 error, invalid filter operator', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents/all')
          .query({ 'filters[body][foo]': 'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
              'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
              'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          statusCode: 400,
          message: [
            'filters.body.property foo should not exist'
          ],
          error: 'Bad Request'
        });
      });

      test('{"query":{"filters[body][$eq]":"..."}} - 400 error, invalid filter value', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents/all')
          .query({ 'filters[body][$eq]': 'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
              'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
              'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          statusCode: 400,
          message: [
            'filters.body.$eq must be shorter than or equal to 100 characters'
          ],
          error: 'Bad Request'
        });
      });

      test('{"query":{"filters[body][$ne]":"..."}} - 400 error, invalid filter value', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents/all')
          .query({ 'filters[body][$ne]': 'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
              'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
              'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          statusCode: 400,
          message: [
            'filters.body.$ne must be shorter than or equal to 100 characters'
          ],
          error: 'Bad Request'
        });
      });

      test('{"query":{"filters[body][$in]":["...","..."]}} - 400 error, invalid filter value', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents/all')
          .query({ 'filters[body][$in]': [
            'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
            'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
            'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.',
            'Voluptas exercitationem officia nisi. Quis quidem dicta molestias necessitatibus ullam soluta saepe voluptatibus. Quas similique qui.\n' +
            'Occaecati ad ducimus quis non sapiente officia. Nisi iure eveniet fuga officiis earum praesentium. Reprehenderit ipsum eaque autem facere ex quaerat.\n' +
            'Soluta soluta ullam sapiente corporis earum numquam corrupti voluptatum accusantium. Illum iure exercitationem optio deleniti perferendis ducimus perspiciatis repudiandae dicta. Cum repellendus laboriosam provident optio temporibus dignissimos voluptas.'
          ] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          statusCode: 400,
          message: [
            'filters.body.each value in $in must be shorter than or equal to 100 characters'
          ],
          error: 'Bad Request'
        });
      });

      test('{"query":{"filters[body][$notIn]":["...","..."]}} - 400 error, invalid filter value', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents/all')
          .query({ 'filters[body][$notIn]': [
            'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
            'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
            'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.',
            'Voluptas exercitationem officia nisi. Quis quidem dicta molestias necessitatibus ullam soluta saepe voluptatibus. Quas similique qui.\n' +
            'Occaecati ad ducimus quis non sapiente officia. Nisi iure eveniet fuga officiis earum praesentium. Reprehenderit ipsum eaque autem facere ex quaerat.\n' +
            'Soluta soluta ullam sapiente corporis earum numquam corrupti voluptatum accusantium. Illum iure exercitationem optio deleniti perferendis ducimus perspiciatis repudiandae dicta. Cum repellendus laboriosam provident optio temporibus dignissimos voluptas.'
          ] })
          .set('Authorization', authorization);
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          statusCode: 400,
          message: [
            'filters.body.each value in $notIn must be shorter than or equal to 100 characters'
          ],
          error: 'Bad Request'
        });
      });

      test('{"query":{"filters[body][$like]":"ab"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents/all')
          .query({ 'filters[body][$like]': 'ab' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(contentsListSchema);
        expect(res.body).toHaveLength(15);
        res.body.forEach(item => expect(item.body).toMatch('ab'));
      });

      test('{"query":{"filters[body][$notLike]":"ab"}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents/all')
          .query({ 'filters[body][$notLike]': 'ab' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(contentsListSchema);
        expect(res.body).toHaveLength(5);
        res.body.forEach(item => expect(item.body).not.toMatch('ab'));
      });

      test('{"query":{"filters[body][$like]":"ab","filters[body][$notLike]":"ab"}} - success, only last filter', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents/all')
          .query({
            'filters[body][$like]': 'ab',
            'filters[body][$notLike]': 'ab'
          })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(contentsListSchema);
        expect(res.body).toHaveLength(5);
        res.body.forEach(item => expect(item.body).not.toMatch('ab'));
      });

      test('{"query":{"filters[body][$notLike]":"ab","filters[body][$like]":"ab"}} - success, only last filter', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents/all')
          .query({
            'filters[body][$notLike]': 'ab',
            'filters[body][$like]': 'ab'
          })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(contentsListSchema);
        expect(res.body).toHaveLength(15);
        res.body.forEach(item => expect(item.body).toMatch('ab'));
      });
    });
  });

  describe('/api/contents/:id (GET)', () => {
    test('{"params":{"id":1},"query":{}} - 401 error, invalid token', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/contents/1')
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
        .get('/api/contents/a')
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
        .get('/api/contents/100')
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
        .get('/api/contents/1')
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
        .get('/api/contents/1')
        .query({})
        .set('Authorization', authorization);
      expect(res.status).toEqual(200);
      expect(res.body).toMatchSchema(contentSchema);
      expect(res.body).toHaveProperty('id', 1);
    });

    describe('includes', () => {
      test('{"params":{"id":1},{"query":{"includes":["foo"]}} - 400 error, invalid include value', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents/1')
          .query({ 'includes[]': 'foo' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          statusCode: 400,
          message: [
            'each value in includes must be one of the following values: article'
          ],
          error: 'Bad Request'
        });
      });

      test('{"params":{"id":1},{"query":{"includes":["article"]}} - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/contents/1')
          .query({ 'includes[]': 'article' })
          .set('Authorization', authorization);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchSchema(contentWithArticleSchema);
        expect(res.body).toHaveProperty('id', 1);
      });
    });
  });

  describe('/api/contents (POST)', () => {
    test('{"body":{"article_id":21,"body":"..."}} - 401 error, invalid token', async () => {
      const body = {
        article_id: 21,
        body: 'Ipsum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo.\n' +
          'Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque.\n' +
          'Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
      };
      const res = await request(app.getHttpServer())
        .post('/api/contents')
        .send(body);
      expect(res.status).toEqual(401);
      expect(res.body).toEqual({
        statusCode: 401,
        message: 'Invalid token',
        error: 'Unauthorized'
      });
    });

    test('{"body":{"article_id":100,"body":"..."}} - 400 error, article_id field must contain id of existing Article', async () => {
      const body = {
        article_id: 100,
        body: 'Ipsum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo.\n' +
          'Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque.\n' +
          'Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
      };
      const res = await request(app.getHttpServer())
        .post('/api/contents')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        statusCode: 400,
        message: [
          'article_id field must contain id of existing Article'
        ],
        error: 'Bad Request'
      });
    });

    test('{"body":{"article_id":1,"body":"..."}} - 400 error, article_id field must unique', async () => {
      const body = {
        article_id: 1,
        body: 'Ipsum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo.\n' +
          'Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque.\n' +
          'Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
      };
      const res = await request(app.getHttpServer())
        .post('/api/contents')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        statusCode: 400,
        message: [
          'article_id field must be unique'
        ],
        error: 'Bad Request'
      });
    });

    test('{"body":{"article_id":21,"body":"..."}} - success', async () => {
      await request(app.getHttpServer())
        .post('/api/articles')
        .send({
          user_id: 1,
          title: 'illum beatae soluta',
          description: 'Vero nihil eius quidem. Quaerat ipsum rem animi fugit pariatur deleniti. Neque unde ad quam illo facere.',
          status: 'published'
        })
        .set('Authorization', authorization);

      const body = {
        article_id: 21,
        body: 'Ipsum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo.\n' +
          'Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque.\n' +
          'Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
      };
      const res = await request(app.getHttpServer())
        .post('/api/contents')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(201);
      expect(res.body).toMatchSchema(contentSchema);
      expect(res.body).toMatchObject({
        id: 21,
        article_id: 21,
        body: 'Ipsum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo.\n' +
          'Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque.\n' +
          'Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
      });
    });
  });

  describe('/api/contents/:id (PUT)', () => {
    test('{"params":{"id":21},"body":{"article_id":21,"body":"..."}} - 401 error, invalid token', async () => {
      const body = {
        article_id: 21,
        body: 'Earum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo.\n' +
          'Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque.\n' +
          'Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
      };
      const res = await request(app.getHttpServer())
        .put('/api/contents/21')
        .send(body);
      expect(res.status).toEqual(401);
      expect(res.body).toEqual({
        statusCode: 401,
        message: 'Invalid token',
        error: 'Unauthorized'
      });
    });

    test('{"params":{"id":"a"},"body":{"article_id":21,"body":"..."}} - 400 error, id param must be a number', async () => {
      const body = {
        article_id: 21,
        body: 'Earum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo.\n' +
          'Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque.\n' +
          'Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
      };
      const res = await request(app.getHttpServer())
        .put('/api/contents/a')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
        error: 'Bad Request'
      });
    });

    test('{"params":{"id":100},"body":{"article_id":21,"body":"..."}} - 404 error, entity not found', async () => {
      const body = {
        article_id: 21,
        body: 'Earum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo.\n' +
          'Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque.\n' +
          'Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
      };
      const res = await request(app.getHttpServer())
        .put('/api/contents/100')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(404);
      expect(res.body).toEqual({
        statusCode: 404,
        message: 'Not Found'
      });
    });

    test('{"params":{"id":21},"body":{"article_id":100,"body":"..."}} - 400 error, article_id field must contain id of existing Article', async () => {
      const body = {
        article_id: 100,
        body: 'Earum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo.\n' +
          'Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque.\n' +
          'Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
      };
      const res = await request(app.getHttpServer())
        .put('/api/contents/21')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        statusCode: 400,
        message: [
          'article_id field must contain id of existing Article'
        ],
        error: 'Bad Request'
      });
    });

    test('{"params":{"id":21},"body":{"article_id":1,"body":"..."}} - 400 error, article_id field must be unique', async () => {
      const body = {
        article_id: 1,
        body: 'Earum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo.\n' +
          'Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque.\n' +
          'Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
      };
      const res = await request(app.getHttpServer())
        .put('/api/contents/21')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        statusCode: 400,
        message: [
          'article_id field must be unique'
        ],
        error: 'Bad Request'
      });
    });

    test('{"params":{"id":21},"body":{"article_id":21,"body":"..."}} - success', async () => {
      const body = {
        article_id: 21,
        body: 'Earum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo.\n' +
          'Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque.\n' +
          'Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
      };
      const res = await request(app.getHttpServer())
        .put('/api/contents/21')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(200);
      expect(res.body).toMatchSchema(contentSchema);
      expect(res.body).toMatchObject({
        id: 21,
        article_id: 21,
        body: 'Earum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo.\n' +
          'Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque.\n' +
          'Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
      });
    });
  });

  describe('/api/contents/:id (DELETE)', () => {
    test('{"params":{"id":21}} - 401 error, invalid token', async () => {
      const res = await request(app.getHttpServer()).delete('/api/contents/21');
      expect(res.status).toEqual(401);
      expect(res.body).toEqual({
        statusCode: 401,
        message: 'Invalid token',
        error: 'Unauthorized'
      });
    });

    test('{"params":{"id":"a"}} - 400 error, id param must be a number', async () => {
      const res = await request(app.getHttpServer())
        .delete('/api/contents/a')
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
        .delete('/api/contents/100')
        .set('Authorization', authorization);
      expect(res.status).toEqual(404);
      expect(res.body).toEqual({
        statusCode: 404,
        message: 'Not Found'
      });
    });

    test('{"params":{"id":21}} - success', async () => {
      const res = await request(app.getHttpServer())
        .delete('/api/contents/21')
        .set('Authorization', authorization);
      expect(res.status).toEqual(204);
      expect(res.body).toEqual({});
    });
  });

  afterAll(() => TestAppManager.close());
});
