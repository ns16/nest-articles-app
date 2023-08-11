import { PickType } from '@nestjs/swagger';

import { FindUsersDto } from './find-users.dto';

export class FindAllUsersDto extends PickType(FindUsersDto, ['filters', 'sorts', 'includes']) {}
