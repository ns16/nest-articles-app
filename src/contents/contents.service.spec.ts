import { afterAll, beforeAll, describe, expect, jest, test } from '@jest/globals';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as validator from 'class-validator';
import { Repository } from 'typeorm';
import { FindResponse } from '../common/interfaces';
import { mockRepositoryFactory, MockType } from '../common/test/helpers';
import { ContentsService } from './contents.service';
import { Content } from '../entities/content.entity';

jest.spyOn(validator, 'validate').mockResolvedValue([]);

describe('ContentsService', () => {

  let testingModule: TestingModule;
  let service: ContentsService;
  let mockRepository: MockType<Repository<Content>>;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ContentsService,
        {
          provide: getRepositoryToken(Content),
          useFactory: mockRepositoryFactory
        }
      ]
    }).compile();
    service = testingModule.get(ContentsService);
    mockRepository = testingModule.get(getRepositoryToken(Content));
  });

  describe('find', () => {
    const source = {
      data: [
        {
          id: 1,
          article_id: 1,
          body: 'Harum odio vero expedita nulla quis libero repellat magni culpa. Quas eveniet ratione eum dolorum amet porro inventore aut. Magni amet nam eveniet nulla quibusdam.\nFacere quasi consectetur eligendi in hic. Minima aspernatur modi laborum. Consequatur distinctio fugiat voluptate suscipit corporis a maxime ipsa.\nBeatae accusamus sapiente illum. Veniam placeat eius sunt nobis occaecati. Inventore dolore nostrum quis iure ipsam id assumenda.',
          created_at: '2023-07-01T00:00:00.000Z',
          updated_at: '2023-07-01T00:00:00.000Z'
        },
        {
          id: 2,
          article_id: 2,
          body: 'Vero sit illum. Aut consectetur similique quisquam ab. Tempora eveniet laboriosam odio dolor deserunt optio sit doloribus debitis.\nEst soluta nihil odit dolorum tempore atque. Explicabo amet beatae eaque ducimus voluptates ad fuga repellat facilis. Dolorem nobis nam maxime facere libero consequuntur inventore.\nOdit occaecati laborum sint nostrum. Odio neque architecto deleniti. Assumenda minima qui nulla sapiente modi.',
          created_at: '2023-07-01T00:00:00.000Z',
          updated_at: '2023-07-01T00:00:00.000Z'
        },
        {
          id: 3,
          article_id: 3,
          body: 'Nostrum commodi optio omnis iste dicta nobis dolores. Facilis placeat nemo maxime quae. Eius facere odio voluptates nisi delectus porro amet.\nQuidem velit veniam. Expedita perferendis corporis id eaque id totam repellat. Expedita aliquid praesentium doloremque vitae.\nQuasi officiis doloremque sit temporibus magnam dolorum dolor repellat. Esse assumenda quis accusantium aut error labore laudantium nisi. Recusandae error quidem minima nulla at consequuntur reiciendis architecto.',
          created_at: '2023-07-01T00:00:00.000Z',
          updated_at: '2023-07-01T00:00:00.000Z'
        },
        {
          id: 4,
          article_id: 4,
          body: 'Et dolor repellendus aliquid labore nemo explicabo quaerat. Itaque modi culpa nostrum saepe quia ut. Quam totam culpa commodi nobis a nihil inventore.\nFugiat amet velit quas necessitatibus vero similique laborum sed quae. Id soluta ullam velit. Consequatur eum doloribus minima placeat.\nOmnis dolor cupiditate aspernatur delectus sequi eos cumque. Hic tenetur enim pariatur delectus. Repudiandae amet aliquam fugit quae autem.',
          created_at: '2023-07-01T00:00:00.000Z',
          updated_at: '2023-07-01T00:00:00.000Z'
        },
        {
          id: 5,
          article_id: 5,
          body: 'Blanditiis excepturi ipsam minima. Totam ea iste nisi quisquam ducimus magnam vitae odio exercitationem. Consequatur voluptate fuga ipsum molestiae.\nAb atque veniam iusto maxime ea veritatis. Esse eius excepturi. Ipsum corrupti blanditiis.\nVelit recusandae hic assumenda dolorum quisquam numquam odio hic amet. Architecto cumque animi numquam dignissimos necessitatibus earum. Aliquid beatae placeat.',
          created_at: '2023-07-01T00:00:00.000Z',
          updated_at: '2023-07-01T00:00:00.000Z'
        },
        {
          id: 6,
          article_id: 6,
          body: 'Voluptate cupiditate quia corrupti unde cupiditate. Temporibus debitis nesciunt at quas tempore reiciendis. Iusto fugiat illum voluptates quis neque minus laboriosam.\nTotam accusamus odio ipsum. Iusto natus delectus. Recusandae tenetur delectus porro laboriosam iure velit cupiditate consequatur.\nUnde aliquid suscipit dolorum. Adipisci ducimus incidunt architecto consequatur repellat maxime architecto adipisci neque. Velit maiores veniam.',
          created_at: '2023-07-01T00:00:00.000Z',
          updated_at: '2023-07-01T00:00:00.000Z'
        },
        {
          id: 7,
          article_id: 7,
          body: 'Labore mollitia recusandae sunt neque occaecati. Vel iste rem. Repellendus omnis voluptatem temporibus natus possimus unde optio laboriosam.\nMaiores facilis ratione ab soluta est quod. Mollitia repellat a ad pariatur. Itaque quaerat distinctio nobis ex eaque sunt facere.\nOmnis dolorem totam voluptas neque dolore impedit eaque deserunt ex. Magnam ipsa reiciendis consequatur quia inventore. Fugiat ut voluptates.',
          created_at: '2023-07-01T00:00:00.000Z',
          updated_at: '2023-07-01T00:00:00.000Z'
        },
        {
          id: 8,
          article_id: 8,
          body: 'Natus amet recusandae reiciendis accusamus. Voluptate ipsam iste corrupti. Reprehenderit distinctio itaque voluptas rerum.\nEnim officiis maiores quisquam. Aspernatur deleniti facere dolor enim. Reprehenderit magni ea eaque nam quis ipsa.\nItaque vero voluptatem distinctio laborum iure eum. Expedita ut ipsa non praesentium magni molestias aliquid. Molestias eaque mollitia ullam incidunt dolores velit asperiores consectetur est.',
          created_at: '2023-07-01T00:00:00.000Z',
          updated_at: '2023-07-01T00:00:00.000Z'
        },
        {
          id: 9,
          article_id: 9,
          body: 'Perferendis rerum aspernatur architecto quis quae optio deleniti amet. Quaerat reprehenderit soluta voluptas nihil dicta ut dicta blanditiis. Asperiores fugiat in maiores sit ad eius recusandae.\nOdit ipsa ducimus cupiditate doloribus amet. Vitae quo exercitationem possimus. Ab labore consequatur perferendis.\nHic alias debitis placeat ipsa voluptatibus delectus in temporibus. Quod exercitationem deleniti commodi blanditiis tempora commodi incidunt non rerum. Harum incidunt quae et corporis deleniti quibusdam sequi.',
          created_at: '2023-07-01T00:00:00.000Z',
          updated_at: '2023-07-01T00:00:00.000Z'
        },
        {
          id: 10,
          article_id: 10,
          body: 'Aut delectus ad sapiente eveniet quam nulla. Libero molestias officiis officiis fugit repellendus. Perferendis magnam debitis pariatur modi a.\nDolores distinctio quos odio dolores dolore cum veritatis. Nemo dignissimos aliquam ipsam consequatur dignissimos at distinctio reiciendis. Mollitia blanditiis vel nesciunt facilis.\nEnim quod ipsum rerum enim. Vero odio cupiditate harum in dignissimos iste quis. Facere autem distinctio voluptatum id.',
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

    test('should return paginated contents list', async () => {
      mockRepository.find.mockReturnValue([ ...source.data ]);
      mockRepository.countBy.mockReturnValue(source.pagination.rowCount);
      const result: FindResponse<Content> = await service.find({});
      expect(result).toEqual(source);
      expect(mockRepository.find).toHaveBeenCalledWith({ skip: 0, take: 10, where: {}, relations: [], order: { id: 'ASC' } });
      expect(mockRepository.countBy).toHaveBeenCalledWith({});
    });
  });

  describe('findAll', () => {
    const source = [
      {
        id: 1,
        article_id: 1,
        body: 'Harum odio vero expedita nulla quis libero repellat magni culpa. Quas eveniet ratione eum dolorum amet porro inventore aut. Magni amet nam eveniet nulla quibusdam.\nFacere quasi consectetur eligendi in hic. Minima aspernatur modi laborum. Consequatur distinctio fugiat voluptate suscipit corporis a maxime ipsa.\nBeatae accusamus sapiente illum. Veniam placeat eius sunt nobis occaecati. Inventore dolore nostrum quis iure ipsam id assumenda.',
        created_at: '2023-07-01T00:00:00.000Z',
        updated_at: '2023-07-01T00:00:00.000Z'
      },
      {
        id: 2,
        article_id: 2,
        body: 'Vero sit illum. Aut consectetur similique quisquam ab. Tempora eveniet laboriosam odio dolor deserunt optio sit doloribus debitis.\nEst soluta nihil odit dolorum tempore atque. Explicabo amet beatae eaque ducimus voluptates ad fuga repellat facilis. Dolorem nobis nam maxime facere libero consequuntur inventore.\nOdit occaecati laborum sint nostrum. Odio neque architecto deleniti. Assumenda minima qui nulla sapiente modi.',
        created_at: '2023-07-01T00:00:00.000Z',
        updated_at: '2023-07-01T00:00:00.000Z'
      },
      {
        id: 3,
        article_id: 3,
        body: 'Nostrum commodi optio omnis iste dicta nobis dolores. Facilis placeat nemo maxime quae. Eius facere odio voluptates nisi delectus porro amet.\nQuidem velit veniam. Expedita perferendis corporis id eaque id totam repellat. Expedita aliquid praesentium doloremque vitae.\nQuasi officiis doloremque sit temporibus magnam dolorum dolor repellat. Esse assumenda quis accusantium aut error labore laudantium nisi. Recusandae error quidem minima nulla at consequuntur reiciendis architecto.',
        created_at: '2023-07-01T00:00:00.000Z',
        updated_at: '2023-07-01T00:00:00.000Z'
      },
      {
        id: 4,
        article_id: 4,
        body: 'Et dolor repellendus aliquid labore nemo explicabo quaerat. Itaque modi culpa nostrum saepe quia ut. Quam totam culpa commodi nobis a nihil inventore.\nFugiat amet velit quas necessitatibus vero similique laborum sed quae. Id soluta ullam velit. Consequatur eum doloribus minima placeat.\nOmnis dolor cupiditate aspernatur delectus sequi eos cumque. Hic tenetur enim pariatur delectus. Repudiandae amet aliquam fugit quae autem.',
        created_at: '2023-07-01T00:00:00.000Z',
        updated_at: '2023-07-01T00:00:00.000Z'
      },
      {
        id: 5,
        article_id: 5,
        body: 'Blanditiis excepturi ipsam minima. Totam ea iste nisi quisquam ducimus magnam vitae odio exercitationem. Consequatur voluptate fuga ipsum molestiae.\nAb atque veniam iusto maxime ea veritatis. Esse eius excepturi. Ipsum corrupti blanditiis.\nVelit recusandae hic assumenda dolorum quisquam numquam odio hic amet. Architecto cumque animi numquam dignissimos necessitatibus earum. Aliquid beatae placeat.',
        created_at: '2023-07-01T00:00:00.000Z',
        updated_at: '2023-07-01T00:00:00.000Z'
      },
      {
        id: 6,
        article_id: 6,
        body: 'Voluptate cupiditate quia corrupti unde cupiditate. Temporibus debitis nesciunt at quas tempore reiciendis. Iusto fugiat illum voluptates quis neque minus laboriosam.\nTotam accusamus odio ipsum. Iusto natus delectus. Recusandae tenetur delectus porro laboriosam iure velit cupiditate consequatur.\nUnde aliquid suscipit dolorum. Adipisci ducimus incidunt architecto consequatur repellat maxime architecto adipisci neque. Velit maiores veniam.',
        created_at: '2023-07-01T00:00:00.000Z',
        updated_at: '2023-07-01T00:00:00.000Z'
      },
      {
        id: 7,
        article_id: 7,
        body: 'Labore mollitia recusandae sunt neque occaecati. Vel iste rem. Repellendus omnis voluptatem temporibus natus possimus unde optio laboriosam.\nMaiores facilis ratione ab soluta est quod. Mollitia repellat a ad pariatur. Itaque quaerat distinctio nobis ex eaque sunt facere.\nOmnis dolorem totam voluptas neque dolore impedit eaque deserunt ex. Magnam ipsa reiciendis consequatur quia inventore. Fugiat ut voluptates.',
        created_at: '2023-07-01T00:00:00.000Z',
        updated_at: '2023-07-01T00:00:00.000Z'
      },
      {
        id: 8,
        article_id: 8,
        body: 'Natus amet recusandae reiciendis accusamus. Voluptate ipsam iste corrupti. Reprehenderit distinctio itaque voluptas rerum.\nEnim officiis maiores quisquam. Aspernatur deleniti facere dolor enim. Reprehenderit magni ea eaque nam quis ipsa.\nItaque vero voluptatem distinctio laborum iure eum. Expedita ut ipsa non praesentium magni molestias aliquid. Molestias eaque mollitia ullam incidunt dolores velit asperiores consectetur est.',
        created_at: '2023-07-01T00:00:00.000Z',
        updated_at: '2023-07-01T00:00:00.000Z'
      },
      {
        id: 9,
        article_id: 9,
        body: 'Perferendis rerum aspernatur architecto quis quae optio deleniti amet. Quaerat reprehenderit soluta voluptas nihil dicta ut dicta blanditiis. Asperiores fugiat in maiores sit ad eius recusandae.\nOdit ipsa ducimus cupiditate doloribus amet. Vitae quo exercitationem possimus. Ab labore consequatur perferendis.\nHic alias debitis placeat ipsa voluptatibus delectus in temporibus. Quod exercitationem deleniti commodi blanditiis tempora commodi incidunt non rerum. Harum incidunt quae et corporis deleniti quibusdam sequi.',
        created_at: '2023-07-01T00:00:00.000Z',
        updated_at: '2023-07-01T00:00:00.000Z'
      },
      {
        id: 10,
        article_id: 10,
        body: 'Aut delectus ad sapiente eveniet quam nulla. Libero molestias officiis officiis fugit repellendus. Perferendis magnam debitis pariatur modi a.\nDolores distinctio quos odio dolores dolore cum veritatis. Nemo dignissimos aliquam ipsam consequatur dignissimos at distinctio reiciendis. Mollitia blanditiis vel nesciunt facilis.\nEnim quod ipsum rerum enim. Vero odio cupiditate harum in dignissimos iste quis. Facere autem distinctio voluptatum id.',
        created_at: '2023-07-01T00:00:00.000Z',
        updated_at: '2023-07-01T00:00:00.000Z'
      }
    ];

    test('should return all contents list', async () => {
      mockRepository.find.mockReturnValue([ ...source ]);
      const result: Content[] = await service.findAll({});
      expect(result).toEqual(source);
      expect(mockRepository.find).toHaveBeenCalledWith({ where: {}, relations: [], order: { id: 'ASC' } });
    });
  });

  describe('findOne', () => {
    const source = {
      id: 1,
      article_id: 1,
      body: 'Harum odio vero expedita nulla quis libero repellat magni culpa. Quas eveniet ratione eum dolorum amet porro inventore aut. Magni amet nam eveniet nulla quibusdam.\nFacere quasi consectetur eligendi in hic. Minima aspernatur modi laborum. Consequatur distinctio fugiat voluptate suscipit corporis a maxime ipsa.\nBeatae accusamus sapiente illum. Veniam placeat eius sunt nobis occaecati. Inventore dolore nostrum quis iure ipsam id assumenda.',
      created_at: '2023-07-01T00:00:00.000Z',
      updated_at: '2023-07-01T00:00:00.000Z'
    };

    test('should return specific content', async () => {
      mockRepository.findOne.mockReturnValue({ ...source });
      const result: Content = await service.findOne(source.id, {});
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
      id: 21,
      article_id: 21,
      body: 'Rerum sunt provident velit voluptates a qui. Laborum beatae reprehenderit non suscipit. Adipisci natus dolorem autem.\nHic nostrum itaque aperiam odio aliquam eligendi magnam rem. Sit numquam voluptates dolorum quisquam sequi provident. Sed ad voluptatum ab ullam velit rerum itaque.\nNihil dolorum fugit vel officiis quidem saepe culpa. Voluptatum minus cupiditate in enim. Atque hic nobis vero mollitia aperiam architecto quos.',
      created_at: '2023-07-01T00:00:00.000Z',
      updated_at: '2023-07-01T00:00:00.000Z'
    };
    const body = {
      article_id: 21,
      body: 'Rerum sunt provident velit voluptates a qui. Laborum beatae reprehenderit non suscipit. Adipisci natus dolorem autem.\nHic nostrum itaque aperiam odio aliquam eligendi magnam rem. Sit numquam voluptates dolorum quisquam sequi provident. Sed ad voluptatum ab ullam velit rerum itaque.\nNihil dolorum fugit vel officiis quidem saepe culpa. Voluptatum minus cupiditate in enim. Atque hic nobis vero mollitia aperiam architecto quos.',
    };

    test('should return created content', async () => {
      mockRepository.save.mockReturnValue({ ...source });
      const result: Content = await service.create(body);
      expect(result).toEqual(source);
      expect(mockRepository.save).toHaveBeenCalledWith(body);
    });
  });

  describe('update', () => {
    const source = {
      id: 21,
      article_id: 21,
      body: 'Rerum sunt provident velit voluptates a qui. Laborum beatae reprehenderit non suscipit. Adipisci natus dolorem autem.\nHic nostrum itaque aperiam odio aliquam eligendi magnam rem. Sit numquam voluptates dolorum quisquam sequi provident. Sed ad voluptatum ab ullam velit rerum itaque.\nNihil dolorum fugit vel officiis quidem saepe culpa. Voluptatum minus cupiditate in enim. Atque hic nobis vero mollitia aperiam architecto quos.',
      created_at: '2023-07-01T00:00:00.000Z',
      updated_at: '2023-07-01T00:00:00.000Z'
    };
    const body = {
      article_id: 21,
      body: 'Remur sunt provident velit voluptates a qui. Laborum beatae reprehenderit non suscipit. Adipisci natus dolorem autem.\nHic nostrum itaque aperiam odio aliquam eligendi magnam rem. Sit numquam voluptates dolorum quisquam sequi provident. Sed ad voluptatum ab ullam velit rerum itaque.\nNihil dolorum fugit vel officiis quidem saepe culpa. Voluptatum minus cupiditate in enim. Atque hic nobis vero mollitia aperiam architecto quos.',
    };

    test('should return updated content', async () => {
      const expectedResult = {
        ...source,
        ...body
      };
      mockRepository.findOneBy.mockReturnValue({ ...source });
      mockRepository.save.mockReturnValue({ ...expectedResult });
      const result: Content = await service.update(source.id, body);
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
      id: 21,
      article_id: 21,
      body: 'Rerum sunt provident velit voluptates a qui. Laborum beatae reprehenderit non suscipit. Adipisci natus dolorem autem.\nHic nostrum itaque aperiam odio aliquam eligendi magnam rem. Sit numquam voluptates dolorum quisquam sequi provident. Sed ad voluptatum ab ullam velit rerum itaque.\nNihil dolorum fugit vel officiis quidem saepe culpa. Voluptatum minus cupiditate in enim. Atque hic nobis vero mollitia aperiam architecto quos.',
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
