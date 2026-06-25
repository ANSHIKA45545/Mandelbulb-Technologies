import { error } from '../utils/helpers.js';

export const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err.code === 'P2002') {
    return error(res, 'A record with this value already exists', 409);
  }
  return error(res, err.message || 'Internal server error', err.status || 500);
};

export const notFound = (req, res) => {
  return error(res, `Route ${req.method} ${req.originalUrl} not found`, 404);
};
