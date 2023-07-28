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
import { Content } from '../../entities/content.entity';
import { CreateOrUpdateContentDto } from './dto/create-or-update-content.dto';
import { FindAllContentsDto } from './dto/find-all-contents.dto';
import { FindContentsDto } from './dto/find-contents.dto';
import { FindOneContentDto } from './dto/find-one-content.dto';
import { ContentsService } from './contents.service';

@ApiTags('Contents')
@Controller('contents')
export class ContentsController {
  constructor(private service: ContentsService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get contents paginated list' })
  @ApiOkPaginatedResponse({ description: 'OK', type: Content })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get()
  find(@Query() query: FindContentsDto): Promise<FindResponse<Content>> {
    return this.service.find(query);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all contents' })
  @ApiOkResponse({ description: 'OK', type: [Content] })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('all')
  findAll(@Query() query: FindAllContentsDto): Promise<Content[]> {
    return this.service.findAll(query);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get specific content' })
  @ApiOkResponse({ description: 'OK', type: Content })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Query() query: FindOneContentDto): Promise<Content> {
    return this.service.findOne(id, query);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new content' })
  @ApiCreatedResponse({ description: 'Created', type: Content })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateOrUpdateContentDto): Promise<Content> {
    return this.service.create(body);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update specific content' })
  @ApiOkResponse({ description: 'OK', type: Content })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: CreateOrUpdateContentDto): Promise<Content> {
    return this.service.update(id, body);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete specific content' })
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
