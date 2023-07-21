import { afterAll, beforeAll, describe, expect, jest, test } from '@jest/globals';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as validator from 'class-validator';
import { Repository } from 'typeorm';
import { FindResponse } from '../common/interfaces';
import { mockRepositoryFactory, MockType } from '../common/test/helpers';
import { Tag } from '../entities/tag.entity';
import { TagsService } from './tags.service';

jest.spyOn(validator, 'validate').mockResolvedValue([]);

describe('TagsService', () => {

  let testingModule: TestingModule;
  let service: TagsService;
  let mockRepository: MockType<Repository<Tag>>;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        {
          provide: getRepositoryToken(Tag),
          useFactory: mockRepositoryFactory
        }
      ]
    }).compile();
    service = testingModule.get(TagsService);
    mockRepository = testingModule.get(getRepositoryToken(Tag));
  });

  describe('find', () => {
    const source = {
      data: [
        {
          id: 1,
          name: 'similique',
          created_at: '2023-07-01T00:00:00.000Z',
          updated_at: '2023-07-01T00:00:00.000Z'
        },
        {
          id: 2,
          name: 'labore',
          created_at: '2023-07-01T00:00:00.000Z',
          updated_at: '2023-07-01T00:00:00.000Z'
        },
        {
          id: 3,
          name: 'eligendi',
          created_at: '2023-07-01T00:00:00.000Z',
          updated_at: '2023-07-01T00:00:00.000Z'
        },
        {
          id: 4,
          name: 'praesentium',
          created_at: '2023-07-01T00:00:00.000Z',
          updated_at: '2023-07-01T00:00:00.000Z'
        },
        {
          id: 5,
          name: 'quam',
          created_at: '2023-07-01T00:00:00.000Z',
          updated_at: '2023-07-01T00:00:00.000Z'
        }
      ],
      pagination: {
        page: 1,
        pageCount: 1,
        pageSize: 10,
        rowCount: 5
      }
    };

    test('should return paginated tags list', async () => {
      mockRepository.find.mockReturnValue([ ...source.data ]);
      mockRepository.countBy.mockReturnValue(source.pagination.rowCount);
      const result: FindResponse<Tag> = await service.find({});
      expect(result).toEqual(source);
      expect(mockRepository.find).toHaveBeenCalledWith({ skip: 0, take: 10, where: {}, relations: [], order: { id: 'ASC' } });
      expect(mockRepository.countBy).toHaveBeenCalledWith({});
    });
  });

  describe('findAll', () => {
    const source = [
      {
        id: 1,
        name: 'similique',
        created_at: '2023-07-01T00:00:00.000Z',
        updated_at: '2023-07-01T00:00:00.000Z'
      },
      {
        id: 2,
        name: 'labore',
        created_at: '2023-07-01T00:00:00.000Z',
        updated_at: '2023-07-01T00:00:00.000Z'
      },
      {
        id: 3,
        name: 'eligendi',
        created_at: '2023-07-01T00:00:00.000Z',
        updated_at: '2023-07-01T00:00:00.000Z'
      },
      {
        id: 4,
        name: 'praesentium',
        created_at: '2023-07-01T00:00:00.000Z',
        updated_at: '2023-07-01T00:00:00.000Z'
      },
      {
        id: 5,
        name: 'quam',
        created_at: '2023-07-01T00:00:00.000Z',
        updated_at: '2023-07-01T00:00:00.000Z'
      }
    ];

    test('should return all tags list', async () => {
      mockRepository.find.mockReturnValue([ ...source ]);
      const result: Tag[] = await service.findAll({});
      expect(result).toEqual(source);
      expect(mockRepository.find).toHaveBeenCalledWith({ where: {}, relations: [], order: { id: 'ASC' } });
    });
  });

  describe('findOne', () => {
    const source = {
      id: 1,
      name: 'similique',
      created_at: '2023-07-01T00:00:00.000Z',
      updated_at: '2023-07-01T00:00:00.000Z'
    };

    test('should return specific tag', async () => {
      mockRepository.findOne.mockReturnValue({ ...source });
      const result: Tag = await service.findOne(source.id, {});
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
      id: 6,
      name: 'explicabo',
      created_at: '2023-07-01T00:00:00.000Z',
      updated_at: '2023-07-01T00:00:00.000Z'
    };
    const body = {
      name: 'explicabo'
    };

    test('should return created tag', async () => {
      mockRepository.save.mockReturnValue({ ...source });
      const result: Tag = await service.create(body);
      expect(result).toEqual(source);
      expect(mockRepository.save).toHaveBeenCalledWith(body);
    });
  });

  describe('update', () => {
    const source = {
      id: 6,
      name: 'explicabo',
      created_at: '2023-07-01T00:00:00.000Z',
      updated_at: '2023-07-01T00:00:00.000Z'
    };
    const body = {
      name: 'explibaco'
    };

    test('should return updated tag', async () => {
      const expectedResult = {
        ...source,
        ...body
      };
      mockRepository.findOneBy.mockReturnValue({ ...source });
      mockRepository.save.mockReturnValue({ ...expectedResult });
      const result: Tag = await service.update(source.id, body);
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
      id: 6,
      name: 'explicabo',
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
