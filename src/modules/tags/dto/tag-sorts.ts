import { IsIn, IsOptional, IsString } from 'class-validator';

import { BaseSorts } from '../../../common/dto';

export class TagSorts extends BaseSorts {
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  name: string;
}
