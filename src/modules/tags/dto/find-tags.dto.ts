import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsIn, IsInt, IsOptional, IsPositive, IsString, ValidateNested } from 'class-validator';
import { TagFilters } from './tag-filters';
import { TagSorts } from './tag-sorts';

export class FindTagsDto {
  @ApiProperty({
    type: 'object',
    required: false,
    examples: {
      'Example 1': { value: {} },
      'Example 2': { value: { 'filters[id][$eq]': 1 } }
    }
  })
  @Type(() => TagFilters)
  @IsOptional()
  @ValidateNested()
  filters: TagFilters;

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
  @Type(() => TagSorts)
  @IsOptional()
  @ValidateNested()
  sorts: TagSorts;

  @ApiProperty({
    name: 'includes[]',
    enum: ['articles'],
    type: ['string'],
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsIn(['articles'], { each: true })
  includes: string[];
}
