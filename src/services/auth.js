import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { usersCollection } from '../db/models/user.js';

export const registerUser = async (payload) => {
  const user = await usersCollection.findOne({ email: payload.email });

  if (user !== null) throw createHttpError(409, 'Email is already in use!');

  payload.password = await bcrypt.hash(payload.password, 10);

  return usersCollection.create(payload);
};

export const loginUser = async (email, password) => {
  const user = await usersCollection.findOne({ email });

  if (user === null)
    throw createHttpError(401, 'Email or password is incorrect');

  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch !== true)
    throw createHttpError(401, 'Email or password is incorrect');
};
