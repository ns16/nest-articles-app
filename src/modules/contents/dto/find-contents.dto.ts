import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsIn, IsInt, IsOptional, IsPositive, IsString, ValidateNested } from 'class-validator';
import { ContentFilters } from './content-filters';
import { ContentSorts } from './content-sorts';

export class FindContentsDto {
  @ApiProperty({
    type: 'object',
    required: false,
    examples: {
      'Example 1': { value: {} },
      'Example 2': { value: { 'filters[id][$eq]': 1 } }
    }
  })
  @Type(() => ContentFilters)
  @IsOptional()
  @ValidateNested()
  filters: ContentFilters;

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
  @Type(() => ContentSorts)
  @IsOptional()
  @ValidateNested()
  sorts: ContentSorts;

  @ApiProperty({
    name: 'includes[]',
    enum: ['article'],
    type: ['string'],
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsIn(['article'], { each: true })
  includes: string[];
}
