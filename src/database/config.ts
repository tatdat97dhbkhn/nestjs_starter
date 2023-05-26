import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || '',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10) || 5432,
  username: process.env.POSTGRES_USER || '',
  password: process.env.POSTGRES_PASSWORD || '',
  database: process.env.POSTGRES_DB || '',
  synchronize: true,
  logging: false,
  entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
  subscribers: [],
};
