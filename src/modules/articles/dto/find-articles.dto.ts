import { Type } from 'class-transformer';
import { IsArray, IsIn, IsInt, IsOptional, IsPositive, IsString, ValidateNested } from 'class-validator';
import { ArticleFilters } from './article-filters';
import { ArticleSorts } from './article-sorts';

export class FindArticlesDto {
  @Type(() => ArticleFilters)
  @IsOptional()
  @ValidateNested()
  filters: ArticleFilters;

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

  @Type(() => ArticleSorts)
  @IsOptional()
  @ValidateNested()
  sorts: ArticleSorts;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsIn([
    'user',
    'content',
    'tags'
  ], { each: true })
  includes: string[];
}
