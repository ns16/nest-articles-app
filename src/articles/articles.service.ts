import { Injectable } from '@nestjs/common';
import { BaseService } from '../common/base.service';
import { Article } from '../entities/article.entity';

@Injectable()
export class ArticlesService extends BaseService(Article) {}
