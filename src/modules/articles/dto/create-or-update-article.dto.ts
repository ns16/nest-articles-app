import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateOrUpdateArticleDto {
  @ApiProperty({
    type: 'integer',
    minimum: 1
  })
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  user_id: number;

  @ApiProperty({
    type: 'string',
    maxLength: 100
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  title: string;

  @ApiProperty({
    type: 'string',
    maxLength: 500
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  description: string;

  @ApiProperty({
    type: 'string',
    enum: ['published', 'draft']
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(['published', 'draft'])
  status: string;
}
