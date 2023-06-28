import { PickType } from '@nestjs/mapped-types';
import { FindUsersDto } from './find-users.dto';

export class FindOneUserDto extends PickType(FindUsersDto, ['includes']) {}
