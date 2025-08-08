import { OAuth2Client } from 'google-auth-library';

import { getEnvVar } from './getEnvVar.js';
import createHttpError from 'http-errors';

const googleOAuth2Client = new OAuth2Client({
  clientId: getEnvVar('GOOGLE_CLIENT_ID'),
  clientSecret: getEnvVar('GOOGLE_CLIENT_SECRET'),
  redirectUri: getEnvVar('GOOGLE_REDIRECT_URI'),
});

export const getGoogleOAuthUrl = async () => {
  return googleOAuth2Client.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });
};

export const validateCode = async (code) => {
  const response = await googleOAuth2Client.getToken(code);
  if (!response.tokens.id_token) throw createHttpError(401);

  const ticket = await googleOAuth2Client.verifyIdToken({
    idToken: response.tokens.id_token,
  });

  return ticket;
};
