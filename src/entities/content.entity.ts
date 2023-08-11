import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { ExistsIn } from '../validators/exists-in';
import { IsUnique } from '../validators/is-unique';

import { Article } from './article.entity';
import { Base } from './base.entity';

@Entity('contents')
export class Content extends Base {
  @ApiProperty({
    type: 'integer',
    minimum: 1
  })
  @Column()
  @ExistsIn('Article')
  @IsUnique('Content')
  article_id: number;

  @ApiProperty({ type: 'string' })
  @Column()
  body: string;

  @OneToOne(() => Article, article => article.content)
  @JoinColumn({
    name: 'article_id',
    referencedColumnName: 'id'
  })
  article: Article;
}
