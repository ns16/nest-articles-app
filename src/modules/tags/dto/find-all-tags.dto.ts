import { PickType } from '@nestjs/swagger';

import { FindTagsDto } from './find-tags.dto';

export class FindAllTagsDto extends PickType(FindTagsDto, ['filters', 'sorts', 'includes']) {}
