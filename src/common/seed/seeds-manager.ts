import AppDataSource from '../../data-source';

export default class SeedsManager {

  static seeds = [
    { entity: 'users', data: [], listeners: true },
    { entity: 'articles', data: [], listeners: false },
    { entity: 'contents', data: [], listeners: false },
    { entity: 'tags', data: [], listeners: false },
    { entity: 'articles_tags', data: [], listeners: false },
    { entity: 'admins', data: [], listeners: true }
  ];

  static async getSeedsData() {
    const environment = process.env.NODE_ENV ?? 'development';
    for (const seed of SeedsManager.seeds) {
      try {
        const module = await import(process.cwd() + '/src/seeds/' + environment + '/' + seed.entity.replace('_', '-') + '.seed');
        seed.data.push(...module.default);
      } catch (error) {
        // Ignore cases when the file is not found
      }
    }
    return SeedsManager.seeds;
  }

  static async run(): Promise<void> {
    const seeds = await SeedsManager.getSeedsData();
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    if (process.env.NODE_ENV !== 'test') console.log('Doing seeds...');
    for (const seed of seeds) {
      await AppDataSource.createQueryBuilder().delete().from(seed.entity).execute();
      if (seed.data.length) {
        await AppDataSource.createQueryBuilder()
          .insert()
          .into(seed.entity)
          .values(seed.data)
          .callListeners(Boolean(seed.listeners))
          .execute()
          .then(() => process.env.NODE_ENV !== 'test' ? console.log(`Added ${seed.data.length} rows in ${seed.entity} table`) : undefined);
      }
      await AppDataSource.query(`ALTER TABLE ${seed.entity} AUTO_INCREMENT = ${seed.data.length + 1}`);
    }
    if (process.env.NODE_ENV !== 'test') console.log('Seeds are done!');
    await AppDataSource.destroy();
  }

  static async revert(): Promise<void> {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    if (process.env.NODE_ENV !== 'test') console.log('Reverting seeds...');
    for (const seed of [...SeedsManager.seeds].reverse()) {
      await AppDataSource.createQueryBuilder()
        .delete()
        .from(seed.entity)
        .execute()
        .then(() => process.env.NODE_ENV !== 'test' ? console.log(`Deleted all rows from ${seed.entity} table`) : undefined);
      await AppDataSource.query(`ALTER TABLE ${seed.entity} AUTO_INCREMENT = 1`);
    }
    if (process.env.NODE_ENV !== 'test') console.log('Seeds are reverted!');
    await AppDataSource.destroy();
  }
}
