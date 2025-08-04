import fs from 'node:fs';
import path from 'node:path';
import { randomBytes } from 'crypto';

import Handlebars from 'handlebars';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

import { usersCollection } from '../db/models/user.js';
import { sessionsCollection } from '../db/models/session.js';

import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';

import { getEnvVar } from '../utils/getEnvVar.js';
import { sendMail } from '../utils/sendMail.js';

const REQUEST_PWD_RESET_TEMPLATE = fs.readFileSync(
  path.resolve('src/templates/request-pwd-reset.hbs'),
  { encoding: 'utf-8' },
);

export const registerUser = async (payload) => {
  const user = await usersCollection.findOne({ email: payload.email });

  if (user !== null) throw createHttpError(409, 'Email is already in use!');

  payload.password = await bcrypt.hash(payload.password, 10);

  return usersCollection.create(payload);
};

function createSession() {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
}

export const loginUser = async (email, password) => {
  const user = await usersCollection.findOne({ email });

  if (user === null)
    throw createHttpError(401, 'Email or password is incorrect');
  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch !== true)
    throw createHttpError(401, 'Email or password is incorrect');

  await sessionsCollection.deleteOne({ userId: user._id });
  const newSession = createSession();

  return await sessionsCollection.create({
    userId: user._id,
    ...newSession,
  });
};

export const logoutUser = async (sessionId) => {
  await sessionsCollection.deleteOne({ _id: sessionId });
};

export const refreshSession = async (sessionId, refreshToken) => {
  const session = await sessionsCollection.findById(sessionId);

  if (session === null) throw createHttpError(401, 'Session not found');
  if (session.refreshToken !== refreshToken)
    throw createHttpError(401, 'Refresh token is invalid');
  if (Date.now() > session.refreshTokenValidUntil)
    throw createHttpError(401, 'Refresh token expired');

  await sessionsCollection.deleteOne({ _id: session._id });
  const newSession = createSession();

  return await sessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const requestPasswordReset = async (email) => {
  const user = await usersCollection.findOne({ email });

  if (!user) return;

  const token = jwt.sign(
    {
      sub: user._id,
      name: user.name,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

  const template = Handlebars.compile(REQUEST_PWD_RESET_TEMPLATE);

  await sendMail({
    to: email,
    subject: 'Reset password',
    html: template({
      resetPasswordLink: `${getEnvVar(
        'APP_DOMAIN',
      )}/reset-password?token=${token}`,
    }),
  });
};

export const resetPassword = async (password, token) => {
  let entries;

  try {
    entries = jwt.verify(token, getEnvVar('JWT_SECRET'));
  } catch (error) {
    if (error.name === 'TokenExpiredError')
      throw createHttpError(401, 'Token is expired');

    if (error.name === 'JsonWebTokenError')
      throw createHttpError(401, 'Token is unauthorized');

    throw error;
  }

  const user = await usersCollection.findById(entries.sub);

  if (!user) throw createHttpError(404, 'User not found');

  const hashedPassword = await bcrypt.hash(password, 10);

  await usersCollection.findByIdAndUpdate(user._id, {
    password: hashedPassword,
  });
};
