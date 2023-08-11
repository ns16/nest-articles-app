import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { DateFilter, NumberFilter } from '../filters';

export class BaseFilters {
  @Type(() => NumberFilter)
  @IsOptional()
  @ValidateNested()
  id: NumberFilter;

  @Type(() => DateFilter)
  @IsOptional()
  @ValidateNested()
  created_at: DateFilter;

  @Type(() => DateFilter)
  @IsOptional()
  @ValidateNested()
  updated_at: DateFilter;
}
