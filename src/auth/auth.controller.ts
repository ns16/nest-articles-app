import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { LoginAdminDto } from './dto/login-admin.dto';
import { AuthService } from './auth.service';
import { Public, User } from '../common/decorators';
import { Admin } from '../entities/admin.entity';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginAdminDto, @Res({ passthrough: true }) response: Response): Promise<Admin> {
    const { model, token } = await this.service.login(body);
    response.header('Token', token);
    return model;
  }

  @Get('me')
  async me(@User() user: Admin): Promise<Admin> {
    return user;
  }
}
