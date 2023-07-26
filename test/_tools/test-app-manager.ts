import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

export default class TestAppManager {

  static testingModule: TestingModule;
  static app: INestApplication;

  static async init(): Promise<INestApplication> {
    if (!TestAppManager.testingModule) {
      TestAppManager.testingModule = await Test.createTestingModule({
        imports: [AppModule]
      }).compile();
    }
    if (!TestAppManager.app) {
      const app = TestAppManager.testingModule.createNestApplication();
      app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true
      }));
      app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
      app.setGlobalPrefix('api');
      await app.init();
      TestAppManager.app = app;
    }
    return TestAppManager.app;
  }

  static async close(): Promise<void> {
    if (TestAppManager.app) await TestAppManager.app.close();
    if (TestAppManager.testingModule) await TestAppManager.testingModule.close();
  }

  static async getAuthorization(): Promise<string> {
    if (!TestAppManager.app) return null;
    const body = {
      username: 'ns16',
      password: '123456'
    };
    const res = await request(TestAppManager.app.getHttpServer())
      .post('/api/auth/login')
      .send(body);
    return res.header.token ? `Bearer ${res.header.token}` : null;
  }
}
