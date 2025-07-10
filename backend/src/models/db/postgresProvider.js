import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { logger } from '@utils/common.js';
dotenv.config();

logger.debug('pg connection details', { db: process.env.PG_DATABASE, user: process.env.PG_USER, host: process.env.PG_HOST});

const sequelize = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST || 'localhost',
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: process.env.SSL_MODE === 'require' ? { require: true, rejectUnauthorized: false } : false,
      channel_binding: process.env.CHANNEL_BINDING || 'require'
    }
  }
);

export default sequelize;
