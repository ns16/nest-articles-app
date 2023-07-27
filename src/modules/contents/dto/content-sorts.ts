import { IsIn, IsOptional, IsString } from 'class-validator';
import { BaseSorts } from '../../../common/dto';

export class ContentSorts extends BaseSorts {
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  article_id: string;

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  body: string;
}
