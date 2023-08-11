import { PickType } from '@nestjs/swagger';

import { FindContentsDto } from './find-contents.dto';

export class FindAllContentsDto extends PickType(FindContentsDto, ['filters', 'sorts', 'includes']) {}
