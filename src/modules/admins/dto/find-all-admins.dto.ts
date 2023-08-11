import { PickType } from '@nestjs/swagger';

import { FindAdminsDto } from './find-admins.dto';

export class FindAllAdminsDto extends PickType(FindAdminsDto, ['filters', 'sorts', 'includes']) {}
