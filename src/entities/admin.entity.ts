import { Exclude } from 'class-transformer';
import { Column, Entity } from 'typeorm';
import { Base } from './base.entity';
import { IsUnique } from '../validators/is-unique';

@Entity('admins')
export class Admin extends Base {
  @Column()
  name: string;

  @Column()
  @IsUnique('Admin')
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Exclude()
  tmpPassword: string;

  @Column()
  @IsUnique('Admin')
  email: string;
}
