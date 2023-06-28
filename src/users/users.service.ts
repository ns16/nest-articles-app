import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
import { FindResponse, Pagination } from '../common/interfaces';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { FindOneUserDto } from './dto/find-one-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

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

  async find(query: FindUsersDto): Promise<FindResponse<User>> {
    const [data, count] = await Promise.all([
      this.repository.find(this.getFindManyOptions(query)),
      this.repository.countBy(this.getFindOptionsWhere(query.filters))
    ]);
    return {
      data,
      pagination: UsersService.getPagination(query, count)
    };
  }

  async findAll(query: FindAllUsersDto): Promise<User[]> {
    return this.repository.find(this.getFindOneOptions(query));
  }

  async findOne(id: number, query: FindOneUserDto): Promise<User> {
    const { includes = [] } = query;
    const model = await this.repository.findOne({
      where: { id },
      relations: includes
    });
    if (!model) {
      throw new NotFoundException();
    }
    return model;
  }

  async create(data: CreateUserDto): Promise<User> {
    return await this.validateAndSave(this.repository.create(), data);
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    const model = await this.repository.findOneBy({ id });
    if (!model) {
      throw new NotFoundException();
    }
    return await this.validateAndSave(model, data);
  }

  async remove(id: number): Promise<void> {
    const model = await this.repository.findOneBy({ id });
    if (!model) {
      throw new NotFoundException();
    }
    await this.repository.remove(model);
  }

  private getFindManyOptions(query: FindUsersDto): FindManyOptions<User> {
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

  private getFindOneOptions(query: FindUsersDto | FindAllUsersDto): FindOneOptions<User> {
    const {
      filters,
      sorts,
      includes = []
    } = query;
    return {
      where: this.getFindOptionsWhere(filters),
      relations: includes,
      order: UsersService.getFindOptionsOrder(sorts)
    };
  }

  private getFindOptionsWhere(filters = {}): FindOptionsWhere<User> {
    return Object.entries(filters).reduce((result, [field, filter]) => {
      const operator = Object.keys(filter).at(-1);
      const value = operator ? filter[operator] : undefined;
      if (!operator || !value) {
        return result;
      }
      return {
        ...result,
        [field]: UsersService.operatorsMap[operator](value)
      };
    }, {}) as FindOptionsWhere<User>;
  }

  private static getFindOptionsOrder(sorts = { id: 'asc' }): FindOptionsOrder<User> {
    return Object.entries(sorts).reduce((result, [field, value]) => ({
      ...result,
      [field]: value.toUpperCase()
    }), {}) as FindOptionsOrder<User>;
  }

  private static getPagination(query: FindUsersDto, count: number): Pagination {
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

  private async validateAndSave(model: User, data: CreateUserDto | UpdateUserDto): Promise<User> {
    this.repository.merge(model, data);
    const errors = await validate(model, {
      validationError: {
        target: false
      }
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
}
