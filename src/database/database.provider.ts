import { DataSource } from 'typeorm';
import { DATABASE_CONNECTION } from '../shared/providers-ids';
import { databaseSource } from './data-source';

export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: async (): Promise<DataSource> => {
      return databaseSource.initialize();
    },
  },
];
