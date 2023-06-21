import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { isArray } from 'lodash';
import { In } from 'typeorm';
import AppDataSource from '../data-source';

@ValidatorConstraint({ name: 'existsIn', async: true })
export class ExistsInConstraint implements ValidatorConstraintInterface {
  public async validate(value: any, args: ValidationArguments) {
    const [entityName] = args.constraints;
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    const repository = AppDataSource.getRepository(entityName);
    if (isArray(value)) {
      const entities = await repository.findBy({ id: In(value) });
      return Boolean(entities.length);
    }
    const entity = await repository.findOneBy({ id: value });
    return Boolean(entity);
  }

  public defaultMessage(args: ValidationArguments) {
    const [entityName] = args.constraints;
    return `$property field must contain id of existing ${entityName}`;
  }
}

export function ExistsIn(entityName: string, validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [entityName],
      validator: ExistsInConstraint
    });
  };
}
