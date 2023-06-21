import { Column, Entity } from 'typeorm';
import { Base } from './base.entity';

@Entity('admins')
export class Admin extends Base {
  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  password: string;

  tmpPassword: string;

  @Column()
  email: string;
}
