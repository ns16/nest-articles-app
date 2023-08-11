import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Article } from '../../entities/article.entity';
import { Tag } from '../../entities/tag.entity';

import { CreateOrRemoveArticleTagDto } from './dto/create-or-remove-article-tag.dto';
import { CreateOrRemoveResponse } from './interfaces/create-or-remove-response';

@Injectable()
export class ArticlesTagsService {
  constructor(@InjectRepository(Article) private articleRepository, @InjectRepository(Tag) private tagRepository) {}

  async create(data: CreateOrRemoveArticleTagDto): Promise<Article> {
    const { articleModel, tagModel } = await this.findArticleAndTag(data);
    if (!articleModel.tags.some((tag: Tag) => tag.id === tagModel.id)) articleModel.tags.push(tagModel);
    return this.articleRepository.save(articleModel);
  }

  async remove(data: CreateOrRemoveArticleTagDto): Promise<Article> {
    const { articleModel, tagModel } = await this.findArticleAndTag(data);
    articleModel.tags = articleModel.tags.filter((tag: Tag) => tag.id !== tagModel.id);
    return this.articleRepository.save(articleModel);
  }

  private async findArticleAndTag(data: CreateOrRemoveArticleTagDto): Promise<CreateOrRemoveResponse> {
    const articleModel: Article = await this.articleRepository.findOne({
      where: { id: data.article_id },
      relations: ['tags']
    });
    if (!articleModel) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Article with given id must be exists',
        error: 'Bad Request'
      });
    }
    const tagModel: Tag = await this.tagRepository.findOneBy({ id: data.tag_id });
    if (!tagModel) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Tag with given id must be exists',
        error: 'Bad Request'
      });
    }
    return {
      articleModel,
      tagModel
    };
  }
}
