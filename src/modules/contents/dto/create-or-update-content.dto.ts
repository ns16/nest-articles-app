import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateOrUpdateContentDto {
  @ApiProperty({
    type: 'integer',
    minimum: 1
  })
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  article_id: number;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty()
  @IsString()
  body: string;
}
