import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { logger } from '@utils/common.js';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/booknook_metadata';

mongoose.connect(MONGO_URI, {});

const mongoDb = mongoose.connection;
mongoDb.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoDb.once('open', () => {
  logger.info('MongoDB connected');
});


export default mongoDb;
