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
  password: string;

  tmpPassword: string;

  @Column()
  @IsUnique('Admin')
  email: string;
}
