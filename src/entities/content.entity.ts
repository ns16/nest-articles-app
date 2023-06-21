import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Article } from './article.entity';
import { Base } from './base.entity';
import { ExistsIn } from '../validators/exists-in';
import { IsUnique } from '../validators/is-unique';

@Entity('contents')
export class Content extends Base {
  @Column()
  @ExistsIn('Article')
  @IsUnique('Content')
  article_id: number;

  @Column()
  body: string;

  @OneToOne(() => Article, article => article.content)
  @JoinColumn({
    name: 'article_id',
    referencedColumnName: 'id'
  })
  article: Article;
}
