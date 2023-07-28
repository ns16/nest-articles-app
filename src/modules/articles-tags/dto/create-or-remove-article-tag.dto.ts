import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateOrRemoveArticleTagDto {
  @ApiProperty({
    type: 'integer',
    minimum: 1
  })
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  article_id: number;

  @ApiProperty({
    type: 'integer',
    minimum: 1
  })
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  tag_id: number;
}
