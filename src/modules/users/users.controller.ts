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
import { User } from '../../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { FindOneUserDto } from './dto/find-one-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get users paginated list' })
  @ApiOkPaginatedResponse({ description: 'OK', type: User })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get()
  find(@Query() query: FindUsersDto): Promise<FindResponse<User>> {
    return this.service.find(query);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ description: 'OK', type: [User] })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('all')
  findAll(@Query() query: FindAllUsersDto): Promise<User[]> {
    return this.service.findAll(query);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get specific user' })
  @ApiOkResponse({ description: 'OK', type: User })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Query() query: FindOneUserDto): Promise<User> {
    return this.service.findOne(id, query);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new user' })
  @ApiCreatedResponse({ description: 'Created', type: User })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateUserDto): Promise<User> {
    return this.service.create(body);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update specific user' })
  @ApiOkResponse({ description: 'OK', type: User })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto): Promise<User> {
    return this.service.update(id, body);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete specific user' })
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
