import { Type } from 'class-transformer';
import { IsArray, IsIn, IsInt, IsOptional, IsPositive, IsString, ValidateNested } from 'class-validator';
import { TagFilters } from './tag-filters';
import { TagSorts } from './tag-sorts';

export class FindTagsDto {
  @Type(() => TagFilters)
  @IsOptional()
  @ValidateNested()
  filters: TagFilters;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @IsPositive()
  page: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @IsPositive()
  pageSize: number;

  @Type(() => TagSorts)
  @IsOptional()
  @ValidateNested()
  sorts: TagSorts;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsIn(['articles'], { each: true })
  includes: string[];
}
