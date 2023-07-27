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
import { Content } from '../../entities/content.entity';
import { CreateOrUpdateContentDto } from './dto/create-or-update-content.dto';
import { FindAllContentsDto } from './dto/find-all-contents.dto';
import { FindContentsDto } from './dto/find-contents.dto';
import { FindOneContentDto } from './dto/find-one-content.dto';
import { ContentsService } from './contents.service';

@Controller('contents')
export class ContentsController {
  constructor(private service: ContentsService) {}

  @Get()
  find(@Query() query: FindContentsDto): Promise<FindResponse<Content>> {
    return this.service.find(query);
  }

  @Get('all')
  findAll(@Query() query: FindAllContentsDto): Promise<Content[]> {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Query() query: FindOneContentDto): Promise<Content> {
    return this.service.findOne(id, query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateOrUpdateContentDto): Promise<Content> {
    return this.service.create(body);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: CreateOrUpdateContentDto): Promise<Content> {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}
