import { afterAll, beforeAll, describe, expect, jest, test } from '@jest/globals';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as validator from 'class-validator';
import { Repository } from 'typeorm';
import { FindResponse } from '../common/interfaces';
import { mockRepositoryFactory, MockType } from '../common/test/helpers';
import { User } from '../entities/user.entity';
import { UsersService } from './users.service';

jest.spyOn(validator, 'validate').mockResolvedValue([]);

describe('UsersService', () => {

  let testingModule: TestingModule;
  let service: UsersService;
  let mockRepository: MockType<Repository<User>>;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockRepositoryFactory
        }
      ]
    }).compile();
    service = testingModule.get(UsersService);
    mockRepository = testingModule.get(getRepositoryToken(User));
  });

  describe('find', () => {
    const source = {
      data: [
        {
          id: 1,
          name: 'Jeremy Corwin',
          username: 'Jeremy.Corwin82',
          email: 'Jeremy34@yahoo.com',
          created_at: '2023-07-01T00:00:00.000Z',
          updated_at: '2023-07-01T00:00:00.000Z'
        },
        {
          id: 2,
          name: 'Josianne Jacobson-Hermann',
          username: 'Josianne_Jacobson-Hermann27',
          email: 'Josianne.Jacobson-Hermann@gmail.com',
          created_at: '2023-07-01T00:00:00.000Z',
          updated_at: '2023-07-01T00:00:00.000Z'
        },
        {
          id: 3,
          name: 'Ettie Torphy II',
          username: 'Ettie_Torphy',
          email: 'Ettie.Torphy@hotmail.com',
          created_at: '2023-07-01T00:00:00.000Z',
          updated_at: '2023-07-01T00:00:00.000Z'
        },
        {
          id: 4,
          name: 'Edwina Crona',
          username: 'Edwina_Crona7',
          email: 'Edwina_Crona@yahoo.com',
          created_at: '2023-07-01T00:00:00.000Z',
          updated_at: '2023-07-01T00:00:00.000Z'
        },
        {
          id: 5,
          name: 'Eloy McDermott II',
          username: 'Eloy47',
          email: 'Eloy25@yahoo.com',
          created_at: '2023-07-01T00:00:00.000Z',
          updated_at: '2023-07-01T00:00:00.000Z'
        },
        {
          id: 6,
          name: 'Walker Stehr',
          username: 'Walker.Stehr',
          email: 'Walker.Stehr20@hotmail.com',
          created_at: '2023-07-01T00:00:00.000Z',
          updated_at: '2023-07-01T00:00:00.000Z'
        },
        {
          id: 7,
          name: 'Taryn Luettgen DVM',
          username: 'Taryn_Luettgen83',
          email: 'Taryn_Luettgen@yahoo.com',
          created_at: '2023-07-01T00:00:00.000Z',
          updated_at: '2023-07-01T00:00:00.000Z'
        },
        {
          id: 8,
          name: 'Federico Lesch-Kuvalis III',
          username: 'Federico.Lesch-Kuvalis',
          email: 'Federico_Lesch-Kuvalis56@yahoo.com',
          created_at: '2023-07-01T00:00:00.000Z',
          updated_at: '2023-07-01T00:00:00.000Z'
        },
        {
          id: 9,
          name: 'Trent Mueller',
          username: 'Trent37',
          email: 'Trent60@yahoo.com',
          created_at: '2023-07-01T00:00:00.000Z',
          updated_at: '2023-07-01T00:00:00.000Z'
        },
        {
          id: 10,
          name: 'Chester Rohan',
          username: 'Chester.Rohan43',
          email: 'Chester75@yahoo.com',
          created_at: '2023-07-01T00:00:00.000Z',
          updated_at: '2023-07-01T00:00:00.000Z'
        }
      ],
      pagination: {
        page: 1,
        pageCount: 1,
        pageSize: 10,
        rowCount: 10
      }
    };

    test('should return paginated users list', async () => {
      mockRepository.find.mockReturnValue([ ...source.data ]);
      mockRepository.countBy.mockReturnValue(source.pagination.rowCount);
      const result: FindResponse<User> = await service.find({});
      expect(result).toEqual(source);
      expect(mockRepository.find).toHaveBeenCalledWith({ skip: 0, take: 10, where: {}, relations: [], order: { id: 'ASC' } });
      expect(mockRepository.countBy).toHaveBeenCalledWith({});
    });
  });

  describe('findAll', () => {
    const source = [
      {
        id: 1,
        name: 'Jeremy Corwin',
        username: 'Jeremy.Corwin82',
        email: 'Jeremy34@yahoo.com',
        created_at: '2023-07-01T00:00:00.000Z',
        updated_at: '2023-07-01T00:00:00.000Z'
      },
      {
        id: 2,
        name: 'Josianne Jacobson-Hermann',
        username: 'Josianne_Jacobson-Hermann27',
        email: 'Josianne.Jacobson-Hermann@gmail.com',
        created_at: '2023-07-01T00:00:00.000Z',
        updated_at: '2023-07-01T00:00:00.000Z'
      },
      {
        id: 3,
        name: 'Ettie Torphy II',
        username: 'Ettie_Torphy',
        email: 'Ettie.Torphy@hotmail.com',
        created_at: '2023-07-01T00:00:00.000Z',
        updated_at: '2023-07-01T00:00:00.000Z'
      },
      {
        id: 4,
        name: 'Edwina Crona',
        username: 'Edwina_Crona7',
        email: 'Edwina_Crona@yahoo.com',
        created_at: '2023-07-01T00:00:00.000Z',
        updated_at: '2023-07-01T00:00:00.000Z'
      },
      {
        id: 5,
        name: 'Eloy McDermott II',
        username: 'Eloy47',
        email: 'Eloy25@yahoo.com',
        created_at: '2023-07-01T00:00:00.000Z',
        updated_at: '2023-07-01T00:00:00.000Z'
      },
      {
        id: 6,
        name: 'Walker Stehr',
        username: 'Walker.Stehr',
        email: 'Walker.Stehr20@hotmail.com',
        created_at: '2023-07-01T00:00:00.000Z',
        updated_at: '2023-07-01T00:00:00.000Z'
      },
      {
        id: 7,
        name: 'Taryn Luettgen DVM',
        username: 'Taryn_Luettgen83',
        email: 'Taryn_Luettgen@yahoo.com',
        created_at: '2023-07-01T00:00:00.000Z',
        updated_at: '2023-07-01T00:00:00.000Z'
      },
      {
        id: 8,
        name: 'Federico Lesch-Kuvalis III',
        username: 'Federico.Lesch-Kuvalis',
        email: 'Federico_Lesch-Kuvalis56@yahoo.com',
        created_at: '2023-07-01T00:00:00.000Z',
        updated_at: '2023-07-01T00:00:00.000Z'
      },
      {
        id: 9,
        name: 'Trent Mueller',
        username: 'Trent37',
        email: 'Trent60@yahoo.com',
        created_at: '2023-07-01T00:00:00.000Z',
        updated_at: '2023-07-01T00:00:00.000Z'
      },
      {
        id: 10,
        name: 'Chester Rohan',
        username: 'Chester.Rohan43',
        email: 'Chester75@yahoo.com',
        created_at: '2023-07-01T00:00:00.000Z',
        updated_at: '2023-07-01T00:00:00.000Z'
      }
    ];

    test('should return all users list', async () => {
      mockRepository.find.mockReturnValue([ ...source ]);
      const result: User[] = await service.findAll({});
      expect(result).toEqual(source);
      expect(mockRepository.find).toHaveBeenCalledWith({ where: {}, relations: [], order: { id: 'ASC' } });
    });
  });

  describe('findOne', () => {
    const source = {
      id: 1,
      name: 'Jeremy Corwin',
      username: 'Jeremy.Corwin82',
      email: 'Jeremy34@yahoo.com',
      created_at: '2023-07-01T00:00:00.000Z',
      updated_at: '2023-07-01T00:00:00.000Z'
    };

    test('should return specific user', async () => {
      mockRepository.findOne.mockReturnValue({ ...source });
      const result: User = await service.findOne(source.id, {});
      expect(result).toEqual(source);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: source.id }, relations: [] });
    });

    test('should throw NotFoundException', async () => {
      mockRepository.findOne.mockReturnValue(null);
      await expect(service.findOne(source.id, {}))
        .rejects
        .toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: source.id }, relations: [] });
    });
  });

  describe('create', () => {
    const source = {
      id: 11,
      name: 'Robert Pullen',
      username: 'Asithavelf74',
      email: 'RobertPullen@armyspy.com',
      created_at: '2023-07-01T00:00:00.000Z',
      updated_at: '2023-07-01T00:00:00.000Z'
    };
    const body = {
      name: 'Robert Pullen',
      username: 'Asithavelf74',
      password: 'UQu2Ilah',
      email: 'RobertPullen@armyspy.com'
    };

    test('should return created user', async () => {
      mockRepository.save.mockReturnValue({ ...source });
      const result: User = await service.create(body);
      expect(result).toEqual(source);
      expect(mockRepository.save).toHaveBeenCalledWith(body);
    });
  });

  describe('update', () => {
    const source = {
      id: 11,
      name: 'Robert Pullen',
      username: 'Asithavelf74',
      email: 'RobertPullen@armyspy.com',
      created_at: '2023-07-01T00:00:00.000Z',
      updated_at: '2023-07-01T00:00:00.000Z'
    };
    const body = {
      name: 'Robert Pullen',
      username: 'Asithavelf75',
      email: 'RobertPullen@armyspy.com'
    };

    test('should return updated user', async () => {
      const expectedResult = {
        ...source,
        ...body
      };
      mockRepository.findOneBy.mockReturnValue({ ...source });
      mockRepository.save.mockReturnValue({ ...expectedResult });
      const result: User = await service.update(source.id, body);
      expect(result).toEqual(expectedResult);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: source.id });
      expect(mockRepository.save).toHaveBeenCalledWith(expectedResult);
    });

    test('should throw NotFoundException', async () => {
      mockRepository.findOneBy.mockReturnValue(null);
      await expect(service.update(source.id, body))
        .rejects
        .toThrow(NotFoundException);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: source.id });
    });
  });

  describe('remove', () => {
    const source = {
      id: 11,
      name: 'Robert Pullen',
      username: 'Asithavelf74',
      email: 'RobertPullen@armyspy.com',
      created_at: '2023-07-01T00:00:00.000Z',
      updated_at: '2023-07-01T00:00:00.000Z'
    };

    test('should not return anything', async () => {
      mockRepository.findOneBy.mockReturnValue({ ...source });
      mockRepository.remove.mockReturnValue({ ...source });
      const result: void = await service.remove(source.id);
      expect(result).toBeUndefined();
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: source.id });
    });

    test('should throw NotFoundException', async () => {
      mockRepository.findOneBy.mockReturnValue(null);
      await expect(service.remove(source.id))
        .rejects
        .toThrow(NotFoundException);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: source.id });
    });
  });

  afterAll(async () => {
    await testingModule.close();
  });
});
