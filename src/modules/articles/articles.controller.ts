import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { FindResponse } from '../../common/interfaces';
import { Article } from '../../entities/article.entity';
import { CreateOrUpdateArticleDto } from './dto/create-or-update-article.dto';
import { FindAllArticlesDto } from './dto/find-all-articles.dto';
import { FindArticlesDto } from './dto/find-articles.dto';
import { FindOneArticleDto } from './dto/find-one-article.dto';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
  constructor(private service: ArticlesService) {}

  @Get()
  find(@Query() query: FindArticlesDto): Promise<FindResponse<Article>> {
    return this.service.find(query);
  }

  @Get('all')
  findAll(@Query() query: FindAllArticlesDto): Promise<Article[]> {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Query() query: FindOneArticleDto): Promise<Article> {
    return this.service.findOne(id, query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateOrUpdateArticleDto): Promise<Article> {
    return this.service.create(body);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: CreateOrUpdateArticleDto): Promise<Article> {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}
