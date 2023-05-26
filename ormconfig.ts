import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from './src/database';

const buildDataSource = () => {
  return new DataSource({
    ...config,
    migrations: ['migrations/**/*.ts'],
  } as DataSourceOptions);
};

export default buildDataSource();
