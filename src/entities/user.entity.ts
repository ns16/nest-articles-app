import { Column, Entity, OneToMany } from 'typeorm';
import { Article } from './article.entity';
import { Base } from './base.entity';
import { IsUnique } from '../validators/is-unique';

@Entity('users')
export class User extends Base {
  @Column()
  name: string;

  @Column()
  @IsUnique('User')
  username: string;

  @Column()
  password: string;

  tmpPassword: string;

  @Column()
  @IsUnique('User')
  email: string;

  @OneToMany(() => Article, article => article.user)
  articles: Article[];
}
