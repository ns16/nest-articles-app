import { PickType } from '@nestjs/swagger';

import { FindArticlesDto } from './find-articles.dto';

export class FindOneArticleDto extends PickType(FindArticlesDto, ['includes']) {}
