import { IsBooleanString, IsOptional } from 'class-validator';

export class BooleanFilter {
  @IsOptional()
  @IsBooleanString()
  $eq: boolean;

  @IsOptional()
  @IsBooleanString()
  $ne: boolean;
}
