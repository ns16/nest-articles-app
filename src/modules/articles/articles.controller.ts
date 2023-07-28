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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { ApiOkPaginatedResponse } from '../../common/decorators/api-ok-paginated-response';
import { FindResponse } from '../../common/interfaces';
import { Article } from '../../entities/article.entity';
import { CreateOrUpdateArticleDto } from './dto/create-or-update-article.dto';
import { FindAllArticlesDto } from './dto/find-all-articles.dto';
import { FindArticlesDto } from './dto/find-articles.dto';
import { FindOneArticleDto } from './dto/find-one-article.dto';
import { ArticlesService } from './articles.service';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(private service: ArticlesService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get articles paginated list' })
  @ApiOkPaginatedResponse({ description: 'OK', type: Article })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get()
  find(@Query() query: FindArticlesDto): Promise<FindResponse<Article>> {
    return this.service.find(query);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all articles' })
  @ApiOkResponse({ description: 'OK', type: [Article] })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('all')
  findAll(@Query() query: FindAllArticlesDto): Promise<Article[]> {
    return this.service.findAll(query);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get specific article' })
  @ApiOkResponse({ description: 'OK', type: Article })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Query() query: FindOneArticleDto): Promise<Article> {
    return this.service.findOne(id, query);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new article' })
  @ApiCreatedResponse({ description: 'Created', type: Article })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateOrUpdateArticleDto): Promise<Article> {
    return this.service.create(body);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update specific article' })
  @ApiOkResponse({ description: 'OK', type: Article })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: CreateOrUpdateArticleDto): Promise<Article> {
    return this.service.update(id, body);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete specific article' })
  @ApiNoContentResponse({ description: 'No content' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}
