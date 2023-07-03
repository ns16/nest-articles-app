import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne } from 'typeorm';
import { Base } from './base.entity';
import { Content } from './content.entity';
import { Tag } from './tag.entity';
import { User } from './user.entity';
import { ExistsIn } from '../validators/exists-in';

@Entity('articles')
export class Article extends Base {
  @Column()
  @ExistsIn('User')
  user_id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: string;

  @ManyToOne(() => User, user => user.articles)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id'
  })
  user: User;

  @OneToOne(() => Content, content => content.article)
  content: Content;

  @ManyToMany(() => Tag, tag => tag.articles)
  @JoinTable({
    name: 'articles_tags',
    joinColumn: {
      name: 'article_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id'
    }
  })
  tags: Tag[];
}
