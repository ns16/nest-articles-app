import { jest } from '@jest/globals';
import { Repository } from 'typeorm';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<any>;
};

export const mockRepositoryFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  create: jest.fn(() => ({})),
  merge: jest.fn((target, source) => Object.assign(target, source)),
  save: jest.fn(result => result),
  remove: jest.fn(result => result),
  countBy: jest.fn(result => result),
  find: jest.fn(result => result),
  findOne: jest.fn(result => result),
  findOneBy: jest.fn(result => result)
}));
