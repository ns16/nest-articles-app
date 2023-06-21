import { Column, Entity, OneToMany } from 'typeorm';
import { Article } from './article.entity';
import { Base } from './base.entity';

@Entity('users')
export class User extends Base {
  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  password: string;

  tmpPassword: string;

  @Column()
  email: string;

  @OneToMany(() => Article, article => article.user)
  articles: Article[];
}
