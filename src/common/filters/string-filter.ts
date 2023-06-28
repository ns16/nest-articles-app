import { ArrayNotEmpty, IsArray, IsOptional, IsString, MaxLength } from 'class-validator';

export class StringFilter {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  $eq: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  $ne: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  $in: string[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  $notIn: string[];

  @IsOptional()
  @IsString()
  @MaxLength(100)
  $like: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  $notLike: string;
}
