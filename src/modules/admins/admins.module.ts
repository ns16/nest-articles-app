import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Admin } from '../../entities/admin.entity';

import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
  controllers: [AdminsController],
  providers: [AdminsService]
})
export class AdminsModule {}
