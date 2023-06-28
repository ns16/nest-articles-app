import { IsIn, IsOptional, IsString } from 'class-validator';

export class BaseSorts {
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  id: string;

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  created_at: string;

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  updated_at: string;
}
