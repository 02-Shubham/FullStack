import { env } from './env.js';

const allowedOrigins = new Set([
  ...env.allowedOrigins,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]);

export const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};
