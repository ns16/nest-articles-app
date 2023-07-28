import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { Pagination } from '../dto/pagination';

export const ApiOkPaginatedResponse = <TModel extends Type<any>>({ description, type }: { description: string, type: TModel }) => {
  return applyDecorators(
    ApiExtraModels(type),
    ApiExtraModels(Pagination),
    ApiOkResponse({
      description,
      schema: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              $ref: getSchemaPath(type)
            }
          },
          pagination: {
            $ref: getSchemaPath(Pagination)
          }
        }
      }
    })
  );
};
