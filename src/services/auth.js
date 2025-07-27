import createHttpError from 'http-errors';
import { usersCollection } from '../db/models/user.js';

export const registerUser = async (payload) => {
  const user = usersCollection.findOne({ email: payload.email });

  if (user !== null) throw createHttpError(409, 'Email is already in use!');

  return usersCollection.create(payload);
};
