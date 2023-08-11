import { PickType } from '@nestjs/swagger';

import { FindContentsDto } from './find-contents.dto';

export class FindOneContentDto extends PickType(FindContentsDto, ['includes']) {}
