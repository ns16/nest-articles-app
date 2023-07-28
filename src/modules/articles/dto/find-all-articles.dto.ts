import { PickType } from '@nestjs/swagger';
import { FindArticlesDto } from './find-articles.dto';

export class FindAllArticlesDto extends PickType(FindArticlesDto, ['filters', 'sorts', 'includes']) {}
