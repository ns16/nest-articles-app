import { Type } from 'class-transformer';
import { IsArray, IsIn, IsInt, IsOptional, IsPositive, IsString, ValidateNested } from 'class-validator';
import { UserFilters } from './user-filters';
import { UserSorts } from './user-sorts';

export class FindUsersDto {
  @Type(() => UserFilters)
  @IsOptional()
  @ValidateNested()
  filters: UserFilters;

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

  @Type(() => UserSorts)
  @IsOptional()
  @ValidateNested()
  sorts: UserSorts;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsIn(['articles'], { each: true })
  includes: string[];
}
