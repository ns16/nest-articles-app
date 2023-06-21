import { DataSource } from 'typeorm';
import UsersSeed from './users.seed';
import ArticlesSeed from './articles.seed';
import ContentsSeed from './contents.seed';
import TagsSeed from './tags.seed';
import ArticlesTags from './articles-tags.seed';
import AdminsSeed from './admins.seed';
import AppDataSource from '../data-source';

AppDataSource
  .initialize()
  .then(async (dataSource: DataSource) => {
    console.log('Doing seeds...');

    const seeds = [
      { entity: 'users', data: UsersSeed, listeners: true },
      { entity: 'articles', data: ArticlesSeed, listeners: false },
      { entity: 'contents', data: ContentsSeed, listeners: false },
      { entity: 'tags', data: TagsSeed, listeners: false },
      { entity: 'articles_tags', data: ArticlesTags, listeners: false },
      { entity: 'admins', data: AdminsSeed, listeners: true }
    ];

    for (const seed of seeds) {
      await dataSource.createQueryBuilder().delete().from(seed.entity).execute();
      await dataSource.createQueryBuilder()
        .insert()
        .into(seed.entity)
        .values(seed.data)
        .callListeners(Boolean(seed.listeners))
        .execute()
        .then(() => console.log(`Added ${seed.data.length} rows in ${seed.entity} table`));
      await dataSource.query(`ALTER TABLE ${seed.entity} AUTO_INCREMENT = ${seed.data.length + 1}`);
    }

    console.log('Seeds are done!');
  })
  .catch((error: Error) => console.log(error))
  .finally(() => process.exit());
