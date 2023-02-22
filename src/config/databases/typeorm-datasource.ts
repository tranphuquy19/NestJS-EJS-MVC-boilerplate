import '@shared/env-loader'; // load .env file

import { DataSource } from 'typeorm';
import dataSourceOptions from './ormconfig';

const AppDataSource = new DataSource(dataSourceOptions);

export default AppDataSource;
