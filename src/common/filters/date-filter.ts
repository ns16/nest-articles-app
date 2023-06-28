import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, ArrayNotEmpty, IsArray, IsDate, IsOptional } from 'class-validator';

export class DateFilter {
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  $gt: Date;

  @Type(() => Date)
  @IsOptional()
  @IsDate()
  $gte: Date;

  @Type(() => Date)
  @IsOptional()
  @IsDate()
  $lt: Date;

  @Type(() => Date)
  @IsOptional()
  @IsDate()
  $lte: Date;

  @Type(() => Date)
  @IsOptional()
  @IsDate()
  $eq: Date;

  @Type(() => Date)
  @IsOptional()
  @IsDate()
  $ne: Date;

  @Type(() => Date)
  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsDate({ each: true })
  $between: Date[];

  @Type(() => Date)
  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsDate({ each: true })
  $notBetween: Date[];

  @Type(() => Date)
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsDate({ each: true })
  $in: Date[];

  @Type(() => Date)
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsDate({ each: true })
  $notIn: Date[];
}
