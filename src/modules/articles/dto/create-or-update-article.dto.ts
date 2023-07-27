import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateOrUpdateArticleDto {
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  user_id: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  description: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['published', 'draft'])
  status: string;
}
