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
import { FindResponse } from '../common/interfaces';
import { Tag } from '../entities/tag.entity';
import { CreateOrUpdateTagDto } from './dto/create-or-update-tag.dto';
import { FindAllTagsDto } from './dto/find-all-tags.dto';
import { FindOneTagDto } from './dto/find-one-tag.dto';
import { FindTagsDto } from './dto/find-tags.dto';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private service: TagsService) {}

  @Get()
  find(@Query() query: FindTagsDto): Promise<FindResponse<Tag>> {
    return this.service.find(query);
  }

  @Get('all')
  findAll(@Query() query: FindAllTagsDto): Promise<Tag[]> {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Query() query: FindOneTagDto): Promise<Tag> {
    return this.service.findOne(id, query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateOrUpdateTagDto): Promise<Tag> {
    return this.service.create(body);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: CreateOrUpdateTagDto): Promise<Tag> {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}
