import { PickType } from '@nestjs/mapped-types';
import { FindContentsDto } from './find-contents.dto';

export class FindOneContentDto extends PickType(FindContentsDto, ['includes']) {}
