import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { Repository } from 'typeorm';
import { Admin } from '../../entities/admin.entity';
import { LoginAdminDto } from './dto/login-admin.dto';
import { LoginResponse } from './interfaces/login-response';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin) private repository: Repository<Admin>,
    private jwtService: JwtService
  ) {}

  async login(data: LoginAdminDto): Promise<LoginResponse> {
    const { username, password } = data;
    const model = await this.repository.findOneBy({ username });
    if (!model) {
      throw new UnauthorizedException('Invalid username or password');
    }
    const isValid = await compare(password, model.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid username or password');
    }
    const token = await this.jwtService.signAsync({
      sub: model.id,
      username: model.username
    });
    return {
      model,
      token
    };
  }
}
