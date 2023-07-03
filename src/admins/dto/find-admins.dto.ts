import { Type } from 'class-transformer';
import { IsArray, IsIn, IsInt, IsOptional, IsPositive, IsString, ValidateNested } from 'class-validator';
import { AdminFilters } from './admin-filters';
import { AdminSorts } from './admin-sorts';

export class FindAdminsDto {
  @Type(() => AdminFilters)
  @IsOptional()
  @ValidateNested()
  filters: AdminFilters;

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

  @Type(() => AdminSorts)
  @IsOptional()
  @ValidateNested()
  sorts: AdminSorts;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsIn([], { each: true })
  includes: string[];
}
