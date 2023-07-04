import { Article } from '../../entities/article.entity';
import { Tag } from '../../entities/tag.entity';

export interface CreateOrRemoveResponse {
  articleModel: Article;
  tagModel: Tag;
}
