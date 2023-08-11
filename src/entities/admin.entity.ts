import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity } from 'typeorm';

import { IsUnique } from '../validators/is-unique';

import { Base } from './base.entity';

@Entity('admins')
export class Admin extends Base {
  @ApiProperty({
    type: 'string',
    maxLength: 100
  })
  @Column()
  name: string;

  @ApiProperty({
    type: 'string',
    maxLength: 100
  })
  @Column()
  @IsUnique('Admin')
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Exclude()
  tmpPassword: string;

  @ApiProperty({
    type: 'string',
    maxLength: 100,
    format: 'email'
  })
  @Column()
  @IsUnique('Admin')
  email: string;
}
