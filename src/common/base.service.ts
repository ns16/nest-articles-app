import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate, ValidationError } from 'class-validator';
import {
  Between,
  Equal,
  FindManyOptions,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  In,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Repository
} from 'typeorm';
import { FindResponse, Pagination } from './interfaces';

type BaseServiceType<T> = new (repository: Repository<any>) => T;

export interface IBaseServiceHost {
  find(query: any): Promise<FindResponse<any>>;
  findAll(query: any): Promise<any[]>;
  findOne(id: number, query: any): Promise<any>;
  create(data: any): Promise<any>;
  update(id: number, data: any): Promise<any>;
  remove(id: number): Promise<void>;
}

export function BaseService(entity: any): BaseServiceType<IBaseServiceHost> {
  class BaseServiceHost implements IBaseServiceHost {
    constructor(@InjectRepository(entity) private repository: Repository<any>) {}

    static operatorsMap = {
      $gt: value => MoreThan(value),
      $gte: value => MoreThanOrEqual(value),
      $lt: value => LessThan(value),
      $lte: value => LessThanOrEqual(value),
      $eq: value => Equal(value),
      $ne: value => Not(value),
      $between: value => Between(value[0], value[1]),
      $notBetween: value => Not(Between(value[0], value[1])),
      $in: value => In(value),
      $notIn: value => Not(In(value)),
      $like: value => Like(`%${value}%`),
      $notLike: value => Not(Like(`%${value}%`))
    };

    async find(query: any): Promise<FindResponse<any>> {
      const [data, count] = await Promise.all([
        this.repository.find(this.getFindManyOptions(query)),
        this.repository.countBy(this.getFindOptionsWhere(query.filters))
      ]);
      return {
        data,
        pagination: BaseServiceHost.getPagination(query, count)
      };
    }

    async findAll(query: any): Promise<any[]> {
      return this.repository.find(this.getFindOneOptions(query));
    }

    async findOne(id: number, query: any): Promise<any> {
      const { includes = [] } = query;
      const model = await this.repository.findOne({
        where: { id },
        relations: includes
      } as FindOneOptions<any>);
      if (!model) {
        throw new NotFoundException();
      }
      return model;
    }

    async create(data: any): Promise<any> {
      return await this.validateAndSave(this.repository.create(), data);
    }

    async update(id: number, data: any): Promise<any> {
      const model = await this.repository.findOneBy({ id } as FindOptionsWhere<any>);
      if (!model) {
        throw new NotFoundException();
      }
      return await this.validateAndSave(model, data);
    }

    async remove(id: number): Promise<void> {
      const model = await this.repository.findOneBy({ id } as FindOptionsWhere<any>);
      if (!model) {
        throw new NotFoundException();
      }
      await this.repository.remove(model);
    }

    private async validateAndSave(model: any, data: any): Promise<any> {
      this.repository.merge(model, data);
      const errors = await validate(model, {
        validationError: {
          target: false
        },
        forbidUnknownValues: false
      });
      if (errors.length > 0) {
        throw new BadRequestException({
          statusCode: 400,
          message: errors
            .map((error: ValidationError) => Object.values(error.constraints))
            .reduce((result, constraints) => [...result, ...constraints], []),
          error: 'Bad Request'
        });
      }
      return this.repository.save(model);
    }

    private getFindManyOptions(query: any): FindManyOptions<any> {
      const {
        page = 1,
        pageSize = 10
      } = query;
      return {
        skip: (page - 1) * pageSize,
        take: pageSize,
        ...this.getFindOneOptions(query)
      };
    }

    private getFindOneOptions(query: any): FindOneOptions<any> {
      const {
        filters,
        sorts,
        includes = []
      } = query;
      return {
        where: this.getFindOptionsWhere(filters),
        relations: includes,
        order: BaseServiceHost.getFindOptionsOrder(sorts)
      };
    }

    private getFindOptionsWhere(filters = {}): FindOptionsWhere<any> {
      return Object.entries(filters).reduce((result, [field, filter]) => {
        const operator = Object.keys(filter).at(-1);
        const value = operator ? filter[operator] : undefined;
        if (!operator || !value) {
          return result;
        }
        return {
          ...result,
          [field]: BaseServiceHost.operatorsMap[operator](value)
        };
      }, {}) as FindOptionsWhere<any>;
    }

    private static getFindOptionsOrder(sorts = { id: 'asc' }): FindOptionsOrder<any> {
      return Object.entries(sorts).reduce((result, [field, value]) => ({
        ...result,
        [field]: value.toUpperCase()
      }), {}) as FindOptionsOrder<any>;
    }

    private static getPagination(query: any, count: number): Pagination {
      const {
        page = 1,
        pageSize = 10
      } = query;
      return {
        page: Number(page),
        pageCount: Math.ceil(count / pageSize),
        pageSize: Number(pageSize),
        rowCount: count
      };
    }
  }

  return BaseServiceHost;
}
