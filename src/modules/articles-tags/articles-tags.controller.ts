import { Body, Controller, Delete, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Article } from '../../entities/article.entity';
import { CreateOrRemoveArticleTagDto } from './dto/create-or-remove-article-tag.dto';
import { ArticlesTagsService } from './articles-tags.service';

@ApiTags('Articles-Tags')
@Controller('articles-tags')
export class ArticlesTagsController {
  constructor(private service: ArticlesTagsService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create article-tag relation' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateOrRemoveArticleTagDto): Promise<Article> {
    return this.service.create(body);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete article-tag relation' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Delete()
  async remove(@Body() body: CreateOrRemoveArticleTagDto): Promise<Article> {
    return this.service.remove(body);
  }
}
