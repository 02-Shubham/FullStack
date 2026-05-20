import { env } from '../config/env.js';

export const notFoundHandler = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (error, _req, res, _next) => {
  let statusCode = error.statusCode || 500;
  let message = statusCode === 500 ? 'Internal server error' : error.message;

  if (error.code === 'P2002') {
    statusCode = 409;
    message = 'A record with this value already exists';
  }

  if (error.code === 'P2025') {
    statusCode = 404;
    message = 'Requested resource was not found';
  }

  const response = {
    success: false,
    message,
  };

  if (error.details) {
    response.errors = error.details;
  }

  if (env.nodeEnv === 'development') {
    response.stack = error.stack;
  }

  return res.status(statusCode).json(response);
};
