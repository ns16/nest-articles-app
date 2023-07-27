import { Body, Controller, Delete, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Article } from '../../entities/article.entity';
import { CreateOrRemoveBodyDto } from './dto/create-or-remove-body.dto';
import { ArticlesTagsService } from './articles-tags.service';

@Controller('articles-tags')
export class ArticlesTagsController {
  constructor(private service: ArticlesTagsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateOrRemoveBodyDto): Promise<Article> {
    return this.service.create(body);
  }

  @Delete()
  async remove(@Body() body: CreateOrRemoveBodyDto): Promise<Article> {
    return this.service.remove(body);
  }
}
