import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateOrRemoveBodyDto {
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  article_id: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  tag_id: number;
}
