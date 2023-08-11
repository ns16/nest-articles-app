import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Response } from 'express';

import { Public, User } from '../../common/decorators';
import { Admin } from '../../entities/admin.entity';

import { AuthService } from './auth.service';
import { LoginAdminDto } from './dto/login-admin.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Invalid username or password' })
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginAdminDto, @Res({ passthrough: true }) response: Response): Promise<Admin> {
    const { model, token } = await this.service.login(body);
    response.header('Token', token);
    return model;
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get authorized admin' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('me')
  async me(@User() user: Admin): Promise<Admin> {
    return user;
  }
}
