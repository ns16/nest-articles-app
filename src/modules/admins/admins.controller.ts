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
import { Admin } from '../../entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { FindAdminsDto } from './dto/find-admins.dto';
import { FindAllAdminsDto } from './dto/find-all-admins.dto';
import { FindOneAdminDto } from './dto/find-one-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminsService } from './admins.service';

@ApiTags('Admins')
@Controller('admins')
export class AdminsController {
  constructor(private service: AdminsService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get admins paginated list' })
  @ApiOkPaginatedResponse({ description: 'OK', type: Admin })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get()
  find(@Query() query: FindAdminsDto): Promise<FindResponse<Admin>> {
    return this.service.find(query);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all admins' })
  @ApiOkResponse({ description: 'OK', type: [Admin] })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('all')
  findAll(@Query() query: FindAllAdminsDto): Promise<Admin[]> {
    return this.service.findAll(query);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get specific admin' })
  @ApiOkResponse({ description: 'OK', type: Admin })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Query() query: FindOneAdminDto): Promise<Admin> {
    return this.service.findOne(id, query);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new admin' })
  @ApiCreatedResponse({ description: 'Created', type: Admin })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateAdminDto): Promise<Admin> {
    return this.service.create(body);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update specific admin' })
  @ApiOkResponse({ description: 'OK', type: Admin })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateAdminDto): Promise<Admin> {
    return this.service.update(id, body);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete specific admin' })
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
