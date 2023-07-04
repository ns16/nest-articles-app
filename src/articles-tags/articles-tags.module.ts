import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesTagsController } from './articles-tags.controller';
import { ArticlesTagsService } from './articles-tags.service';
import { Article } from '../entities/article.entity';
import { Tag } from '../entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Article,
    Tag
  ])],
  controllers: [ArticlesTagsController],
  providers: [ArticlesTagsService]
})
export class ArticlesTagsModule {}
