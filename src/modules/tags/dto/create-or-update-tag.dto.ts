import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateOrUpdateTagDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;
}
