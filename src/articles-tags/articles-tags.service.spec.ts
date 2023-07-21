import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { omit } from 'lodash';
import { Repository } from 'typeorm';
import { ArticlesTagsService } from './articles-tags.service';
import { mockRepositoryFactory, MockType } from '../common/test/helpers';
import { Article } from '../entities/article.entity';
import { Tag } from '../entities/tag.entity';

describe('ArticlesTagsService', () => {

  let testingModule: TestingModule;
  let service: ArticlesTagsService;
  let mockArticleRepository: MockType<Repository<Article>>;
  let mockTagRepository: MockType<Repository<Tag>>;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ArticlesTagsService,
        {
          provide: getRepositoryToken(Article),
          useFactory: mockRepositoryFactory
        },
        {
          provide: getRepositoryToken(Tag),
          useFactory: mockRepositoryFactory
        }
      ]
    }).compile();
    service = testingModule.get(ArticlesTagsService);
    mockArticleRepository = testingModule.get(getRepositoryToken(Article));
    mockTagRepository = testingModule.get(getRepositoryToken(Tag));
  });

  describe('create', () => {
    const articleSource = {
      id: 1,
      user_id: 1,
      title: 'quas repudiandae aspernatur',
      description: 'Saepe dolorum nostrum praesentium enim. Aut reprehenderit corrupti similique cumque porro reiciendis. Vero facilis modi nam optio tempore reprehenderit enim.',
      status: 'published',
      created_at: '2023-07-01T00:00:00.000Z',
      updated_at: '2023-07-01T00:00:00.000Z',
      tags: [
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
        }
      ]
    };
    const tagSource = {
      id: 5,
      name: 'quam',
      created_at: '2023-07-01T00:00:00.000Z',
      updated_at: '2023-07-01T00:00:00.000Z'
    };
    const body = {
      article_id: 1,
      tag_id: 5
    };

    test('should return article and its tags', async () => {
      const expectedResult = {
        ...omit(articleSource, ['tags']),
        tags: [
          ...articleSource.tags,
          tagSource
        ]
      };
      mockArticleRepository.findOne.mockReturnValue({ ...articleSource });
      mockTagRepository.findOneBy.mockReturnValue({ ...tagSource });
      mockArticleRepository.save.mockReturnValue({ ...expectedResult });
      const result: Article = await service.create(body);
      expect(result).toEqual(expectedResult);
      expect(mockArticleRepository.findOne).toHaveBeenCalledWith({ where: { id: articleSource.id }, relations: ['tags'] });
      expect(mockTagRepository.findOneBy).toHaveBeenCalledWith({ id: tagSource.id });
      expect(mockArticleRepository.save).toHaveBeenCalledWith(expectedResult);
    });

    test('should throw BadRequestException (article not found)', async () => {
      mockArticleRepository.findOne.mockReturnValue(null);
      await expect(service.create(body))
        .rejects
        .toThrow(BadRequestException);
      expect(mockArticleRepository.findOne).toHaveBeenCalledWith({ where: { id: articleSource.id }, relations: ['tags'] });
    });

    test('should throw BadRequestException (tag not found)', async () => {
      mockArticleRepository.findOne.mockReturnValue({ ...articleSource });
      mockTagRepository.findOneBy.mockReturnValue(null);
      await expect(service.create(body))
        .rejects
        .toThrow(BadRequestException);
      expect(mockArticleRepository.findOne).toHaveBeenCalledWith({ where: { id: articleSource.id }, relations: ['tags'] });
      expect(mockTagRepository.findOneBy).toHaveBeenCalledWith({ id: tagSource.id });
    });
  });

  describe('remove', () => {
    const articleSource = {
      id: 1,
      user_id: 1,
      title: 'quas repudiandae aspernatur',
      description: 'Saepe dolorum nostrum praesentium enim. Aut reprehenderit corrupti similique cumque porro reiciendis. Vero facilis modi nam optio tempore reprehenderit enim.',
      status: 'published',
      created_at: '2023-07-01T00:00:00.000Z',
      updated_at: '2023-07-01T00:00:00.000Z',
      tags: [
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
      ]
    };
    const tagSource = {
      id: 5,
      name: 'quam',
      created_at: '2023-07-01T00:00:00.000Z',
      updated_at: '2023-07-01T00:00:00.000Z'
    };
    const body = {
      article_id: 1,
      tag_id: 5
    };

    test('should return article and its tags', async () => {
      const expectedResult = {
        ...omit(articleSource, ['tags']),
        tags: [
          ...articleSource.tags.filter(tag => tag.id !== tagSource.id),
        ]
      };
      mockArticleRepository.findOne.mockReturnValue({ ...articleSource });
      mockTagRepository.findOneBy.mockReturnValue({ ...tagSource });
      mockArticleRepository.save.mockReturnValue({ ...expectedResult });
      const result: Article = await service.remove(body);
      expect(result).toEqual(expectedResult);
      expect(mockArticleRepository.findOne).toHaveBeenCalledWith({ where: { id: articleSource.id }, relations: ['tags'] });
      expect(mockTagRepository.findOneBy).toHaveBeenCalledWith({ id: tagSource.id });
      expect(mockArticleRepository.save).toHaveBeenCalledWith(expectedResult);
    });

    test('should throw BadRequestException (article not found)', async () => {
      mockArticleRepository.findOne.mockReturnValue(null);
      await expect(service.create(body))
        .rejects
        .toThrow(BadRequestException);
      expect(mockArticleRepository.findOne).toHaveBeenCalledWith({ where: { id: articleSource.id }, relations: ['tags'] });
    });

    test('should throw BadRequestException (tag not found)', async () => {
      mockArticleRepository.findOne.mockReturnValue({ ...articleSource });
      mockTagRepository.findOneBy.mockReturnValue(null);
      await expect(service.create(body))
        .rejects
        .toThrow(BadRequestException);
      expect(mockArticleRepository.findOne).toHaveBeenCalledWith({ where: { id: articleSource.id }, relations: ['tags'] });
      expect(mockTagRepository.findOneBy).toHaveBeenCalledWith({ id: tagSource.id });
    });
  });

  afterAll(async () => {
    await testingModule.close();
  });
});
