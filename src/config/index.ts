export const config = () => ({
  host: process.env.HOST,
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV,
  database: {
    type: 'mysql' as const,
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
    synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE),
    logging: Boolean(process.env.DATABASE_LOGGING),
    migrationsRun: Boolean(process.env.DATABASE_MIGRATIONS_RUN),
    entities: ['dist/**/**.entity.js'],
    subscribers: ['dist/**/**.subscriber.js'],
    migrations: ['dist/migrations/**/*.js']
  }
});
