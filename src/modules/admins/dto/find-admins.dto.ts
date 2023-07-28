import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsIn, IsInt, IsOptional, IsPositive, IsString, ValidateNested } from 'class-validator';
import { AdminFilters } from './admin-filters';
import { AdminSorts } from './admin-sorts';

export class FindAdminsDto {
  @ApiProperty({
    type: 'object',
    required: false,
    examples: {
      'Example 1': { value: {} },
      'Example 2': { value: { 'filters[id][$eq]': 1 } }
    }
  })
  @Type(() => AdminFilters)
  @IsOptional()
  @ValidateNested()
  filters: AdminFilters;

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
  @Type(() => AdminSorts)
  @IsOptional()
  @ValidateNested()
  sorts: AdminSorts;

  @ApiProperty({
    name: 'includes[]',
    enum: [],
    type: ['string'],
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsIn([], { each: true })
  includes: string[];
}
