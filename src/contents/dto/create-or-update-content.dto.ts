import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateOrUpdateContentDto {
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  article_id: number;

  @IsNotEmpty()
  @IsString()
  body: string;
}
