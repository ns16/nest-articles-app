import { INestApplication } from '@nestjs/common';
import { matchers } from 'jest-json-schema';
import * as request from 'supertest';

import MigrationsManager from '../src/common/migration/migrations-manager';
import SeedsManager from '../src/common/seed/seeds-manager';

import { articleWithTagsSchema } from './_tools/schemas';
import TestAppManager from './_tools/test-app-manager';

expect.extend(matchers);

describe('ArticlesTagsController (e2e)', () => {
  let app: INestApplication;
  let authorization: string;

  beforeAll(async () => {
    await MigrationsManager.run();
    await SeedsManager.run();
    app = await TestAppManager.init();
    authorization = await TestAppManager.getAuthorization();
  });

  describe('/api/articles-tags (POST)', () => {
    test('{"body":{"article_id":1,"tag_id":1}} - 401 error, invalid token', async () => {
      const body = {
        article_id: 1,
        tag_id: 1
      };
      const res = await request(app.getHttpServer()).post('/api/articles-tags').send(body);
      expect(res.status).toEqual(401);
      expect(res.body).toEqual({
        statusCode: 401,
        message: 'Invalid token',
        error: 'Unauthorized'
      });
    });

    test('{"body":{"article_id":100,"tag_id":1}} - 400 error, article with given id must be exists', async () => {
      const body = {
        article_id: 100,
        tag_id: 1
      };
      const res = await request(app.getHttpServer())
        .post('/api/articles-tags')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        statusCode: 400,
        message: 'Article with given id must be exists',
        error: 'Bad Request'
      });
    });

    test('{"body":{"article_id":1,"tag_id":100}} - 400 error, tag with given id must be exists', async () => {
      const body = {
        article_id: 1,
        tag_id: 100
      };
      const res = await request(app.getHttpServer())
        .post('/api/articles-tags')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        statusCode: 400,
        message: 'Tag with given id must be exists',
        error: 'Bad Request'
      });
    });

    test('{"body":{"article_id":1,"tag_id":1}} - success', async () => {
      const body = {
        article_id: 1,
        tag_id: 1
      };
      const res = await request(app.getHttpServer())
        .post('/api/articles-tags')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(201);
      expect(res.body).toMatchSchema(articleWithTagsSchema);
      expect(res.body.id).toEqual(body.article_id);
      expect(res.body.tags.some(tag => tag.id === body.tag_id)).toBeTruthy();
      expect(res.body.tags.filter(tag => tag.id === body.tag_id).length === 1).toBeTruthy();
    });

    test('{"body":{"article_id":1,"tag_id":1}} - success, tags relation already exists', async () => {
      const body = {
        article_id: 1,
        tag_id: 1
      };
      const res = await request(app.getHttpServer())
        .post('/api/articles-tags')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(201);
      expect(res.body).toMatchSchema(articleWithTagsSchema);
      expect(res.body.id).toEqual(body.article_id);
      expect(res.body.tags.some(tag => tag.id === body.tag_id)).toBeTruthy();
      expect(res.body.tags.filter(tag => tag.id === body.tag_id).length === 1).toBeTruthy();
    });
  });

  describe('/api/articles-tags (DELETE)', () => {
    test('{"body":{"article_id":1,"tag_id":1}} - 401 error, invalid token', async () => {
      const body = {
        article_id: 1,
        tag_id: 1
      };
      const res = await request(app.getHttpServer()).delete('/api/articles-tags').send(body);
      expect(res.status).toEqual(401);
      expect(res.body).toEqual({
        statusCode: 401,
        message: 'Invalid token',
        error: 'Unauthorized'
      });
    });

    test('{"body":{"article_id":100,"tag_id":1}} - 400 error, article with given id must be exists', async () => {
      const body = {
        article_id: 100,
        tag_id: 1
      };
      const res = await request(app.getHttpServer())
        .delete('/api/articles-tags')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        statusCode: 400,
        message: 'Article with given id must be exists',
        error: 'Bad Request'
      });
    });

    test('{"body":{"article_id":1,"tag_id":100}} - 400 error, tag with given id must be exists', async () => {
      const body = {
        article_id: 1,
        tag_id: 100
      };
      const res = await request(app.getHttpServer())
        .delete('/api/articles-tags')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        statusCode: 400,
        message: 'Tag with given id must be exists',
        error: 'Bad Request'
      });
    });

    test('{"body":{"article_id":1,"tag_id":1}} - success', async () => {
      const body = {
        article_id: 1,
        tag_id: 1
      };
      const res = await request(app.getHttpServer())
        .delete('/api/articles-tags')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(200);
      expect(res.body).toMatchSchema(articleWithTagsSchema);
      expect(res.body.id).toEqual(body.article_id);
      expect(res.body.tags.some(tag => tag.id === body.tag_id)).not.toBeTruthy();
    });

    test('{"body":{"article_id":1,"tag_id":1}} - success, tags relation does not exist', async () => {
      const body = {
        article_id: 1,
        tag_id: 1
      };
      const res = await request(app.getHttpServer())
        .delete('/api/articles-tags')
        .send(body)
        .set('Authorization', authorization);
      expect(res.status).toEqual(200);
      expect(res.body).toMatchSchema(articleWithTagsSchema);
      expect(res.body.id).toEqual(body.article_id);
      expect(res.body.tags.some(tag => tag.id === body.tag_id)).not.toBeTruthy();
    });
  });

  afterAll(() => TestAppManager.close());
});
