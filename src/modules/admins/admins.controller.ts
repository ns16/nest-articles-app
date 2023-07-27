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
import { Admin } from '../../entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { FindAdminsDto } from './dto/find-admins.dto';
import { FindAllAdminsDto } from './dto/find-all-admins.dto';
import { FindOneAdminDto } from './dto/find-one-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminsService } from './admins.service';

@Controller('admins')
export class AdminsController {
  constructor(private service: AdminsService) {}

  @Get()
  find(@Query() query: FindAdminsDto): Promise<FindResponse<Admin>> {
    return this.service.find(query);
  }

  @Get('all')
  findAll(@Query() query: FindAllAdminsDto): Promise<Admin[]> {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Query() query: FindOneAdminDto): Promise<Admin> {
    return this.service.findOne(id, query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateAdminDto): Promise<Admin> {
    return this.service.create(body);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateAdminDto): Promise<Admin> {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}
