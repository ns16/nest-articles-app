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
    database: process.env.NODE_ENV !== 'test' ? process.env.DATABASE_DATABASE : `${process.env.DATABASE_DATABASE}_test`,
    synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE),
    logging: Boolean(process.env.DATABASE_LOGGING),
    migrationsRun: Boolean(process.env.DATABASE_MIGRATIONS_RUN),
    entities: process.env.NODE_ENV !== 'test' ? ['dist/**/**.entity.js'] : ['src/**/**.entity.ts'],
    subscribers: process.env.NODE_ENV !== 'test' ? ['dist/**/**.subscriber.js'] : ['src/**/**.subscriber.ts'],
    migrations: process.env.NODE_ENV !== 'test' ? ['dist/migrations/**/*.js'] : ['src/migrations/**/*.ts']
  },
  jwtKey: process.env.JWT_KEY
});
