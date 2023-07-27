import { PickType } from '@nestjs/mapped-types';
import { FindTagsDto } from './find-tags.dto';

export class FindOneTagDto extends PickType(FindTagsDto, ['includes']) {}
