import { PickType } from '@nestjs/mapped-types';
import { FindContentsDto } from './find-contents.dto';

export class FindAllContentsDto extends PickType(FindContentsDto, ['filters', 'sorts', 'includes']) {}
