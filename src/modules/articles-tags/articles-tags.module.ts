import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Article } from '../../entities/article.entity';
import { Tag } from '../../entities/tag.entity';

import { ArticlesTagsController } from './articles-tags.controller';
import { ArticlesTagsService } from './articles-tags.service';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Tag])],
  controllers: [ArticlesTagsController],
  providers: [ArticlesTagsService]
})
export class ArticlesTagsModule {}
