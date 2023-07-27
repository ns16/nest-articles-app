import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { BaseFilters } from '../../../common/dto';
import { NumberFilter, StringFilter } from '../../../common/filters';

export class ContentFilters extends BaseFilters {
  @Type(() => NumberFilter)
  @IsOptional()
  @ValidateNested()
  article_id: NumberFilter;

  @Type(() => StringFilter)
  @IsOptional()
  @ValidateNested()
  body: StringFilter;
}
