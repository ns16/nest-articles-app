import { Injectable } from '@nestjs/common';
import { BaseService } from '../../common/base.service';
import { User } from '../../entities/user.entity';

@Injectable()
export class UsersService extends BaseService(User) {}
