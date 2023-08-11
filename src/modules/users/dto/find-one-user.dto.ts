import { PickType } from '@nestjs/swagger';

import { FindUsersDto } from './find-users.dto';

export class FindOneUserDto extends PickType(FindUsersDto, ['includes']) {}
