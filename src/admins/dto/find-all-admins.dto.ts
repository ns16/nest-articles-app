import { PickType } from '@nestjs/mapped-types';
import { FindAdminsDto } from './find-admins.dto';

export class FindAllAdminsDto extends PickType(FindAdminsDto, ['filters', 'sorts', 'includes']) {}
