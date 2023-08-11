import { afterAll, beforeAll, describe, expect, jest, test } from '@jest/globals';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as validator from 'class-validator';
import { Repository } from 'typeorm';

import { FindResponse } from '../../common/interfaces';
import { mockRepositoryFactory, MockType } from '../../common/test/helpers';
import { Article } from '../../entities/article.entity';

import { ArticlesService } from './articles.service';

jest.spyOn(validator, 'validate').mockResolvedValue([]);

describe('ArticlesService', () => {
  let testingModule: TestingModule;
  let service: ArticlesService;
  let mockRepository: MockType<Repository<Article>>;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: getRepositoryToken(Article),
          useFactory: mockRepositoryFactory
        }
      ]
    }).compile();
    service = testingModule.get(ArticlesService);
    mockRepository = testingModule.get(getRepositoryToken(Article));
  });

  describe('find', () => {
    const source = {
      data: [
        {
          id: 1,
          user_id: 1,
          title: 'quas repudiandae aspernatur',
          description:
            'Saepe dolorum nostrum praesentium enim. Aut reprehenderit corrupti similique cumque porro reiciendis. Vero facilis modi nam optio tempore reprehenderit enim.',
          status: 'published',
          created_at: '2023-07-01T00:00:00.000Z',
          updated_at: '2023-07-01T00:00:00.000Z'
        },
        {
          id: 2,
          user_id: 1,
          title: 'optio tempora quo',
          description:
            'Eos sapiente dolor voluptas deleniti. Magnam eum minima vel repellendus totam quasi qui soluta corporis. Nobis ipsam quae labore illo reiciendis explicabo.',
          status: 'published',
          created_at: '2023-07-01T00:00:00.000Z',
          updated_at: '2023-07-01T00:00:00.000Z'
        },
        {
          id: 3,
          user_id: 2,
          title: 'dolorem ad at',
          description:
            'Beatae impedit cumque a porro pariatur explicabo. Consequatur saepe est aut voluptatum veniam reiciendis quod. Animi repellendus totam perferendis nesciunt libero a autem laborum.',
          status: 'published',
          created_at: '2023-07-01T00:00:00.000Z',
          updated_at: '2023-07-01T00:00:00.000Z'
        },
        {
          id: 4,
          user_id: 2,
          title: 'labore optio veritatis',
          description:
            'Distinctio incidunt nisi ex impedit dolorem tempore eius. Ipsam nobis ex expedita. Possimus reprehenderit voluptates ipsa deleniti earum quasi saepe aperiam dolor.',
          status: 'published',
          created_at: '2023-07-01T00:00:00.000Z',
          updated_at: '2023-07-01T00:00:00.000Z'
        },
        {
          id: 5,
          user_id: 3,
          title: 'debitis aliquam quaerat',
          description:
            'Quos deleniti nulla iure dolorem mollitia. Ad corporis saepe aperiam illo illum voluptatibus commodi deserunt. Ab distinctio porro nisi.',
          status: 'published',
          created_at: '2023-07-01T00:00:00.000Z',
          updated_at: '2023-07-01T00:00:00.000Z'
        },
        {
          id: 6,
          user_id: 3,
          title: 'occaecati repellendus voluptates',
          description:
            'Qui ullam ad perferendis magni odio ratione unde. Nisi molestiae non itaque nulla nulla amet. Nihil blanditiis iusto ut consequuntur dolore consequuntur magni adipisci.',
          status: 'published',
          created_at: '2023-07-01T00:00:00.000Z',
          updated_at: '2023-07-01T00:00:00.000Z'
        },
        {
          id: 7,
          user_id: 4,
          title: 'suscipit velit odio',
          description:
            'Incidunt nam dolor dolor. Iure repellendus est labore at pariatur. Repellendus vel reiciendis accusantium non.',
          status: 'published',
          created_at: '2023-07-01T00:00:00.000Z',
          updated_at: '2023-07-01T00:00:00.000Z'
        },
        {
          id: 8,
          user_id: 4,
          title: 'aut saepe esse',
          description: 'Tempore commodi explicabo iusto. Cumque autem tempora optio. Eius soluta eos quia.',
          status: 'published',
          created_at: '2023-07-01T00:00:00.000Z',
          updated_at: '2023-07-01T00:00:00.000Z'
        },
        {
          id: 9,
          user_id: 5,
          title: 'fuga non ullam',
          description:
            'Minus odio quasi adipisci maxime numquam architecto ducimus est. Delectus atque itaque enim. Maxime autem molestiae eum.',
          status: 'published',
          created_at: '2023-07-01T00:00:00.000Z',
          updated_at: '2023-07-01T00:00:00.000Z'
        },
        {
          id: 10,
          user_id: 5,
          title: 'id et excepturi',
          description: 'Quis eveniet magni. Fugit eos maxime. Nam quod quidem eveniet.',
          status: 'published',
          created_at: '2023-07-01T00:00:00.000Z',
          updated_at: '2023-07-01T00:00:00.000Z'
        }
      ],
      pagination: {
        page: 1,
        pageCount: 2,
        pageSize: 10,
        rowCount: 20
      }
    };

    test('should return paginated articles list', async () => {
      mockRepository.find.mockReturnValue([...source.data]);
      mockRepository.countBy.mockReturnValue(source.pagination.rowCount);
      const result: FindResponse<Article> = await service.find({});
      expect(result).toEqual(source);
      expect(mockRepository.find).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: {},
        relations: [],
        order: { id: 'ASC' }
      });
      expect(mockRepository.countBy).toHaveBeenCalledWith({});
    });
  });

  describe('findAll', () => {
    const source = [
      {
        id: 1,
        user_id: 1,
        title: 'quas repudiandae aspernatur',
        description:
          'Saepe dolorum nostrum praesentium enim. Aut reprehenderit corrupti similique cumque porro reiciendis. Vero facilis modi nam optio tempore reprehenderit enim.',
        status: 'published',
        created_at: '2023-07-01T00:00:00.000Z',
        updated_at: '2023-07-01T00:00:00.000Z'
      },
      {
        id: 2,
        user_id: 1,
        title: 'optio tempora quo',
        description:
          'Eos sapiente dolor voluptas deleniti. Magnam eum minima vel repellendus totam quasi qui soluta corporis. Nobis ipsam quae labore illo reiciendis explicabo.',
        status: 'published',
        created_at: '2023-07-01T00:00:00.000Z',
        updated_at: '2023-07-01T00:00:00.000Z'
      },
      {
        id: 3,
        user_id: 2,
        title: 'dolorem ad at',
        description:
          'Beatae impedit cumque a porro pariatur explicabo. Consequatur saepe est aut voluptatum veniam reiciendis quod. Animi repellendus totam perferendis nesciunt libero a autem laborum.',
        status: 'published',
        created_at: '2023-07-01T00:00:00.000Z',
        updated_at: '2023-07-01T00:00:00.000Z'
      },
      {
        id: 4,
        user_id: 2,
        title: 'labore optio veritatis',
        description:
          'Distinctio incidunt nisi ex impedit dolorem tempore eius. Ipsam nobis ex expedita. Possimus reprehenderit voluptates ipsa deleniti earum quasi saepe aperiam dolor.',
        status: 'published',
        created_at: '2023-07-01T00:00:00.000Z',
        updated_at: '2023-07-01T00:00:00.000Z'
      },
      {
        id: 5,
        user_id: 3,
        title: 'debitis aliquam quaerat',
        description:
          'Quos deleniti nulla iure dolorem mollitia. Ad corporis saepe aperiam illo illum voluptatibus commodi deserunt. Ab distinctio porro nisi.',
        status: 'published',
        created_at: '2023-07-01T00:00:00.000Z',
        updated_at: '2023-07-01T00:00:00.000Z'
      },
      {
        id: 6,
        user_id: 3,
        title: 'occaecati repellendus voluptates',
        description:
          'Qui ullam ad perferendis magni odio ratione unde. Nisi molestiae non itaque nulla nulla amet. Nihil blanditiis iusto ut consequuntur dolore consequuntur magni adipisci.',
        status: 'published',
        created_at: '2023-07-01T00:00:00.000Z',
        updated_at: '2023-07-01T00:00:00.000Z'
      },
      {
        id: 7,
        user_id: 4,
        title: 'suscipit velit odio',
        description:
          'Incidunt nam dolor dolor. Iure repellendus est labore at pariatur. Repellendus vel reiciendis accusantium non.',
        status: 'published',
        created_at: '2023-07-01T00:00:00.000Z',
        updated_at: '2023-07-01T00:00:00.000Z'
      },
      {
        id: 8,
        user_id: 4,
        title: 'aut saepe esse',
        description: 'Tempore commodi explicabo iusto. Cumque autem tempora optio. Eius soluta eos quia.',
        status: 'published',
        created_at: '2023-07-01T00:00:00.000Z',
        updated_at: '2023-07-01T00:00:00.000Z'
      },
      {
        id: 9,
        user_id: 5,
        title: 'fuga non ullam',
        description:
          'Minus odio quasi adipisci maxime numquam architecto ducimus est. Delectus atque itaque enim. Maxime autem molestiae eum.',
        status: 'published',
        created_at: '2023-07-01T00:00:00.000Z',
        updated_at: '2023-07-01T00:00:00.000Z'
      },
      {
        id: 10,
        user_id: 5,
        title: 'id et excepturi',
        description: 'Quis eveniet magni. Fugit eos maxime. Nam quod quidem eveniet.',
        status: 'published',
        created_at: '2023-07-01T00:00:00.000Z',
        updated_at: '2023-07-01T00:00:00.000Z'
      }
    ];

    test('should return all articles list', async () => {
      mockRepository.find.mockReturnValue([...source]);
      const result: Article[] = await service.findAll({});
      expect(result).toEqual(source);
      expect(mockRepository.find).toHaveBeenCalledWith({ where: {}, relations: [], order: { id: 'ASC' } });
    });
  });

  describe('findOne', () => {
    const source = {
      id: 1,
      user_id: 1,
      title: 'quas repudiandae aspernatur',
      description:
        'Saepe dolorum nostrum praesentium enim. Aut reprehenderit corrupti similique cumque porro reiciendis. Vero facilis modi nam optio tempore reprehenderit enim.',
      status: 'published',
      created_at: '2023-07-01T00:00:00.000Z',
      updated_at: '2023-07-01T00:00:00.000Z'
    };

    test('should return specific article', async () => {
      mockRepository.findOne.mockReturnValue({ ...source });
      const result: Article = await service.findOne(source.id, {});
      expect(result).toEqual(source);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: source.id }, relations: [] });
    });

    test('should throw NotFoundException', async () => {
      mockRepository.findOne.mockReturnValue(null);
      await expect(service.findOne(source.id, {})).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: source.id }, relations: [] });
    });
  });

  describe('create', () => {
    const source = {
      id: 21,
      user_id: 1,
      title: 'sint in modi',
      description:
        'Molestiae excepturi commodi nam nobis qui. Laboriosam ab tenetur debitis amet corporis id debitis. Voluptas totam ullam minus veniam dolor deserunt tempore.',
      status: 'published',
      created_at: '2023-07-01T00:00:00.000Z',
      updated_at: '2023-07-01T00:00:00.000Z'
    };
    const body = {
      user_id: 1,
      title: 'sint in modi',
      description:
        'Molestiae excepturi commodi nam nobis qui. Laboriosam ab tenetur debitis amet corporis id debitis. Voluptas totam ullam minus veniam dolor deserunt tempore.',
      status: 'published'
    };

    test('should return created article', async () => {
      mockRepository.save.mockReturnValue({ ...source });
      const result: Article = await service.create(body);
      expect(result).toEqual(source);
      expect(mockRepository.save).toHaveBeenCalledWith(body);
    });
  });

  describe('update', () => {
    const source = {
      id: 21,
      user_id: 1,
      title: 'sint in modi',
      description:
        'Molestiae excepturi commodi nam nobis qui. Laboriosam ab tenetur debitis amet corporis id debitis. Voluptas totam ullam minus veniam dolor deserunt tempore.',
      status: 'published',
      created_at: '2023-07-01T00:00:00.000Z',
      updated_at: '2023-07-01T00:00:00.000Z'
    };
    const body = {
      user_id: 1,
      title: 'sint in domi',
      description:
        'Molestiae excepturi commodi nam nobis qui. Laboriosam ab tenetur debitis amet corporis id debitis. Voluptas totam ullam minus veniam dolor deserunt tempore.',
      status: 'published'
    };

    test('should return updated article', async () => {
      const expectedResult = {
        ...source,
        ...body
      };
      mockRepository.findOneBy.mockReturnValue({ ...source });
      mockRepository.save.mockReturnValue({ ...expectedResult });
      const result: Article = await service.update(source.id, body);
      expect(result).toEqual(expectedResult);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: source.id });
      expect(mockRepository.save).toHaveBeenCalledWith(expectedResult);
    });

    test('should throw NotFoundException', async () => {
      mockRepository.findOneBy.mockReturnValue(null);
      await expect(service.update(source.id, body)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: source.id });
    });
  });

  describe('remove', () => {
    const source = {
      id: 21,
      user_id: 1,
      title: 'sint in modi',
      description:
        'Molestiae excepturi commodi nam nobis qui. Laboriosam ab tenetur debitis amet corporis id debitis. Voluptas totam ullam minus veniam dolor deserunt tempore.',
      status: 'published',
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
      await expect(service.remove(source.id)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: source.id });
    });
  });

  afterAll(async () => {
    await testingModule.close();
  });
});
