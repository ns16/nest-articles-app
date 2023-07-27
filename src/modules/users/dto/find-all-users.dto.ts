import { PickType } from '@nestjs/mapped-types';
import { FindUsersDto } from './find-users.dto';

export class FindAllUsersDto extends PickType(FindUsersDto, ['filters', 'sorts', 'includes']) {}
