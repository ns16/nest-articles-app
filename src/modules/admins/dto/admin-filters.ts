import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { BaseFilters } from '../../../common/dto';
import { StringFilter } from '../../../common/filters';

export class AdminFilters extends BaseFilters {
  @Type(() => StringFilter)
  @IsOptional()
  @ValidateNested()
  name: StringFilter;

  @Type(() => StringFilter)
  @IsOptional()
  @ValidateNested()
  username: StringFilter;

  @Type(() => StringFilter)
  @IsOptional()
  @ValidateNested()
  email: StringFilter;
}
