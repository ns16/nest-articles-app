import { IsIn, IsOptional, IsString } from 'class-validator';

import { BaseSorts } from '../../../common/dto';

export class AdminSorts extends BaseSorts {
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  name: string;

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  username: string;

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  email: string;
}
