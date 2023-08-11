import { instanceToPlain } from 'class-transformer';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { isEmpty, isUndefined } from 'lodash';

import AppDataSource from '../data-source';

@ValidatorConstraint({ name: 'isUnique', async: true })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  public async validate(value: any, args: ValidationArguments) {
    const [entityName, fieldNames = []] = args.constraints;
    const where = {};
    if (!isUndefined(args.object[args.property])) {
      where[args.property] = value;
    }
    fieldNames.forEach((fn: string) => (where[fn] = args.object[fn]));
    if (isEmpty(where)) {
      return true;
    }
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    const repository = AppDataSource.getRepository(entityName);
    if ((args.object as any).id) {
      const currentEntity = await repository.findOneBy({ id: (args.object as any).id });
      if (!currentEntity) {
        return true;
      }
      const currentObject = instanceToPlain(currentEntity);
      if (Object.entries(where).every(([field, value]: [string, any]) => currentObject[field] === value)) {
        return true;
      }
    }
    const entity = await repository.findOneBy(where);
    return !entity;
  }

  public defaultMessage(args: ValidationArguments) {
    const [, fieldNames = []] = args.constraints;
    if (fieldNames.length === 0) {
      return '$property field must be unique';
    } else if (fieldNames.length === 1) {
      return `$property and ${fieldNames[0]} fields must be unique`;
    }
    return `$property, ${fieldNames.slice(0, -1).join(', ')} and ${
      fieldNames[fieldNames.length - 1]
    } fields must be unique`;
  }
}

export function IsUnique(entityName: any, fieldNames?: string[], validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [entityName, fieldNames],
      validator: IsUniqueConstraint
    });
  };
}
