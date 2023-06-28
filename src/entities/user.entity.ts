import { Exclude } from 'class-transformer';
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
  @Exclude()
  password: string;

  @Exclude()
  tmpPassword: string;

  @Column()
  @IsUnique('User')
  email: string;

  @OneToMany(() => Article, article => article.user)
  articles: Article[];
}
