import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsIn, IsInt, IsOptional, IsPositive, IsString, ValidateNested } from 'class-validator';
import { ArticleFilters } from './article-filters';
import { ArticleSorts } from './article-sorts';

export class FindArticlesDto {
  @ApiProperty({
    type: 'object',
    required: false,
    examples: {
      'Example 1': { value: {} },
      'Example 2': { value: { 'filters[id][$eq]': 1 } }
    }
  })
  @Type(() => ArticleFilters)
  @IsOptional()
  @ValidateNested()
  filters: ArticleFilters;

  @ApiProperty({
    type: 'integer',
    required: false,
    minimum: 1
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @IsPositive()
  page: number;

  @ApiProperty({
    type: 'integer',
    required: false,
    minimum: 1
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @IsPositive()
  pageSize: number;

  @ApiProperty({
    type: 'object',
    required: false,
    examples: {
      'Example 1': { value: {} },
      'Example 2': { value: { 'sorts[id]': 'asc' } }
    }
  })
  @Type(() => ArticleSorts)
  @IsOptional()
  @ValidateNested()
  sorts: ArticleSorts;

  @ApiProperty({
    name: 'includes[]',
    enum: [
      'user',
      'content',
      'tags'
    ],
    type: ['string'],
    required: false
  })
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
