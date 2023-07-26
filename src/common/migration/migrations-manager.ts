import AppDataSource from '../../data-source';

export default class MigrationsManager {
  static async run(): Promise<void> {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    await AppDataSource.runMigrations();
    await AppDataSource.destroy();
  }
}
