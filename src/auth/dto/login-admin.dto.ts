import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginAdminDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  password: string;
}
