import { IsIn, IsOptional, IsString } from 'class-validator';

import { BaseSorts } from '../../../common/dto';

export class ArticleSorts extends BaseSorts {
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  user_id: string;

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  title: string;

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  description: string;

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  status: string;
}
