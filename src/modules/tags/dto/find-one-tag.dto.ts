import { PickType } from '@nestjs/swagger';

import { FindTagsDto } from './find-tags.dto';

export class FindOneTagDto extends PickType(FindTagsDto, ['includes']) {}
