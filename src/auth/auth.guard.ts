import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { IS_PUBLIC } from '../common/decorators';
import { Admin } from '../entities/admin.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(Admin) private repository: Repository<Admin>,
    private reflector: Reflector,
    private configService: ConfigService,
    private jwtService: JwtService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [context.getHandler()]);
    if (isPublic) {
      return true;
    }
    const request: Request = context.switchToHttp().getRequest();
    const token = AuthGuard.extractToken(request);
    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, { secret: this.configService.get('jwtKey') });
      request['user'] = await this.repository.findOneBy({ id: payload.sub });
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }

  private static extractToken(request: Request): string {
    const [type, token] = request.header('Authorization')?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
