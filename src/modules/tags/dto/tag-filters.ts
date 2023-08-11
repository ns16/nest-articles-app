import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { BaseFilters } from '../../../common/dto';
import { StringFilter } from '../../../common/filters';

export class TagFilters extends BaseFilters {
  @Type(() => StringFilter)
  @IsOptional()
  @ValidateNested()
  name: StringFilter;
}
