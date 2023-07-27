import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { BaseFilters } from '../../../common/dto';
import { NumberFilter, StringFilter } from '../../../common/filters';

export class ArticleFilters extends BaseFilters {
  @Type(() => NumberFilter)
  @IsOptional()
  @ValidateNested()
  user_id: NumberFilter;

  @Type(() => StringFilter)
  @IsOptional()
  @ValidateNested()
  title: StringFilter;

  @Type(() => StringFilter)
  @IsOptional()
  @ValidateNested()
  description: StringFilter;

  @Type(() => StringFilter)
  @IsOptional()
  @ValidateNested()
  status: StringFilter;
}
