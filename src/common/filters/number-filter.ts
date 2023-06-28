import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, ArrayNotEmpty, IsArray, IsInt, IsOptional, IsPositive } from 'class-validator';

export class NumberFilter {
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @IsPositive()
  $gt: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @IsPositive()
  $gte: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @IsPositive()
  $lt: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @IsPositive()
  $lte: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @IsPositive()
  $eq: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @IsPositive()
  $ne: number;

  @Type(() => Number)
  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsInt({ each: true })
  @IsPositive({ each: true })
  $between: number[];

  @Type(() => Number)
  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsInt({ each: true })
  @IsPositive({ each: true })
  $notBetween: number[];

  @Type(() => Number)
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  $in: number[];

  @Type(() => Number)
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  $notIn: number[];
}
