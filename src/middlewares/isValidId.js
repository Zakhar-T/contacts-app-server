import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId = (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    throw createHttpError(400, 'Bad Request');
  }
  next();
};
