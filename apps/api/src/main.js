import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import routes from './routes/index.js';
import { errorMiddleware } from './middleware/index.js';
import logger from './utils/logger.js';

const app = express();

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection at:', promise, 'reason:', reason);
});

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (origin === 'http://localhost:3000') return true;
  if (origin === 'http://localhost:5173') return true;
  if (process.env.CORS_ORIGIN && origin === process.env.CORS_ORIGIN) return true;
  if (/^https:\/\/sistema-check-.*\.vercel\.app$/.test(origin)) return true;
  return false;
}

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (isAllowedOrigin(origin)) {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Vary', 'Origin');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes());

app.use(errorMiddleware);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const port = process.env.PORT || 3001;

if (!process.env.VERCEL) {
  app.listen(port, () => {
    logger.info(`🚀 API Server running on http://localhost:${port}`);
  });
}

export default app;