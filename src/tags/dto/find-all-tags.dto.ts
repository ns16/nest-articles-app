import { PickType } from '@nestjs/mapped-types';
import { FindTagsDto } from './find-tags.dto';

export class FindAllTagsDto extends PickType(FindTagsDto, ['filters', 'sorts', 'includes']) {}
