import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoDb from '@models/db/mongoProvider.js';
import startGraphQL from '@graphql/index.js';
import router from '@routes/index.js';
import { UPLOADS_DIR } from '@configs/index.js';
import { logger } from '@utils/common.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const PORT = process.env.PORT || 4000;

mongoDb.once('open', async () => {
  logger.info('MongoDB connected, starting server...');
  await startGraphQL(app);
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
});

app.use('/api', router)

// Auth middleware to verify JWT and add user to request

// Serve images from the uploads directory
app.use('/uploads', express.static(UPLOADS_DIR));


// Global error handler
app.use((err, req, res, next) => {
  // If the error has a status, use it; otherwise, default to 500
  const status = err.status || 500;
  // If the error has a message, use it; otherwise, use a generic message
  const message = err.message || 'Internal Server Error';
  res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export default app;

