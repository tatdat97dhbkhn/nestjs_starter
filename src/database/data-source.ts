import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { config } from './config';
dotenv.config();

export const databaseSource = new DataSource(config as DataSourceOptions);
