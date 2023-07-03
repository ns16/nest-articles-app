import { Injectable } from '@nestjs/common';
import { BaseService } from '../common/base.service';
import { Admin } from '../entities/admin.entity';

@Injectable()
export class AdminsService extends BaseService(Admin) {}
