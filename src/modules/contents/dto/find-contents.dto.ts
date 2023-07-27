import { Type } from 'class-transformer';
import { IsArray, IsIn, IsInt, IsOptional, IsPositive, IsString, ValidateNested } from 'class-validator';
import { ContentFilters } from './content-filters';
import { ContentSorts } from './content-sorts';

export class FindContentsDto {
  @Type(() => ContentFilters)
  @IsOptional()
  @ValidateNested()
  filters: ContentFilters;

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

  @Type(() => ContentSorts)
  @IsOptional()
  @ValidateNested()
  sorts: ContentSorts;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsIn(['article'], { each: true })
  includes: string[];
}
