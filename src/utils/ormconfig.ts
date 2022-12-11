import { DataSource } from 'typeorm';
const ssl = {
  rejectUnauthorized: false,
};

const ent = process.env.NODE_ENV === 'production' ? ['dist/**/*.entities{.ts,.js}'] : ['src/**/*.entities{.ts,.js}'];

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgress://postgres:5432@localhost:5432/fuzz',
  entities: ent,
  synchronize: true,
  ssl: process.env.NODE_ENV === 'production' && ssl,
});

AppDataSource.initialize()
  .then(() => console.log('Database connected'))
  .catch((err) => console.error(err));
