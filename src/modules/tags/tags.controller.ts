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
import { Tag } from '../../entities/tag.entity';
import { CreateOrUpdateTagDto } from './dto/create-or-update-tag.dto';
import { FindAllTagsDto } from './dto/find-all-tags.dto';
import { FindOneTagDto } from './dto/find-one-tag.dto';
import { FindTagsDto } from './dto/find-tags.dto';
import { TagsService } from './tags.service';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(private service: TagsService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get tags paginated list' })
  @ApiOkPaginatedResponse({ description: 'OK', type: Tag })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get()
  find(@Query() query: FindTagsDto): Promise<FindResponse<Tag>> {
    return this.service.find(query);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all tags' })
  @ApiOkResponse({ description: 'OK', type: [Tag] })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('all')
  findAll(@Query() query: FindAllTagsDto): Promise<Tag[]> {
    return this.service.findAll(query);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get specific tag' })
  @ApiOkResponse({ description: 'OK', type: Tag })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Query() query: FindOneTagDto): Promise<Tag> {
    return this.service.findOne(id, query);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new tag' })
  @ApiCreatedResponse({ description: 'Created', type: Tag })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateOrUpdateTagDto): Promise<Tag> {
    return this.service.create(body);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update specific tag' })
  @ApiOkResponse({ description: 'OK', type: Tag })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: CreateOrUpdateTagDto): Promise<Tag> {
    return this.service.update(id, body);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete specific tag' })
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
