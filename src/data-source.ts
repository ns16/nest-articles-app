import { DataSource } from 'typeorm';
import 'dotenv/config';
import { config } from './config';

const { database } = config();

export default new DataSource(database);
