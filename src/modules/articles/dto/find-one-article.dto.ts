import { PickType } from '@nestjs/mapped-types';
import { FindArticlesDto } from './find-articles.dto';

export class FindOneArticleDto extends PickType(FindArticlesDto, ['includes']) {}
