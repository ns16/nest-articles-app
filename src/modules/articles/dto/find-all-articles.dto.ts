import { PickType } from '@nestjs/mapped-types';
import { FindArticlesDto } from './find-articles.dto';

export class FindAllArticlesDto extends PickType(FindArticlesDto, ['filters', 'sorts', 'includes']) {}
