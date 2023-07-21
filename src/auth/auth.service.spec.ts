import { afterAll, beforeAll, describe, expect, jest, test } from '@jest/globals';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { LoginResponse } from './interfaces/login-response';
import { AuthService } from './auth.service';
import { mockRepositoryFactory, MockType } from '../common/test/helpers';
import { Admin } from '../entities/admin.entity';

jest.spyOn(JwtService.prototype, 'signAsync').mockResolvedValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoibnMxNiIsImlhdCI6MTY4OTg2MzMzNX0.EnZsR-3ipVFfaFkOOzK-ZDrNHfHK_FwNu1zWvLvYv7c');

describe('AuthService', () => {

  let testingModule: TestingModule;
  let service: AuthService;
  let mockRepository: MockType<Repository<Admin>>;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: getRepositoryToken(Admin),
          useFactory: mockRepositoryFactory
        }
      ]
    }).compile();
    service = testingModule.get(AuthService);
    mockRepository = testingModule.get(getRepositoryToken(Admin));
  });

  describe('login', () => {
    const source = {
      id: 1,
      name: 'Nikolay Shamayko',
      username: 'ns16',
      email: 'nikolay.shamayko@gmail.com',
      created_at: '2023-07-01T00:00:00.000Z',
      updated_at: '2023-07-01T00:00:00.000Z'
    };
    const body = {
      username: 'ns16',
      password: '123456'
    };

    test('should return admin and token', async () => {
      mockRepository.findOneBy.mockReturnValue({ ...source });
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      const result: LoginResponse = await service.login(body);
      expect(result.model).toEqual(source);
      expect(typeof result.token).toEqual('string');
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ username: source.username });
    });

    test('should throw UnauthorizedException (username is invalid)', async () => {
      mockRepository.findOneBy.mockReturnValue(null);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      await expect(service.login(body))
        .rejects
        .toThrow(UnauthorizedException);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ username: source.username });
    });

    test('should throw UnauthorizedException (password is invalid)', async () => {
      mockRepository.findOneBy.mockReturnValue({ ...source });
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
      await expect(service.login(body))
        .rejects
        .toThrow(UnauthorizedException);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ username: source.username });
    });
  });

  afterAll(async () => {
    await testingModule.close();
  });
});
