import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToMany } from 'typeorm';
import { Article } from './article.entity';
import { Base } from './base.entity';

@Entity('tags')
export class Tag extends Base {
  @ApiProperty({
    type: 'string',
    maxLength: 100
  })
  @Column()
  name: string;

  @ManyToMany(() => Article, article => article.tags)
  articles: Article[];
}
