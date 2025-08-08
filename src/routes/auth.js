import { Router } from 'express';

import {
  confirmGoogleOAuthController,
  getGoogleOAuthUrlController,
  loginController,
  logoutController,
  refreshController,
  registerController,
  requestPasswordResetController,
  resetPasswordController,
} from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  confirmGoogleOAuthSchema,
  loginUserSchema,
  registerUserSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
} from '../validation/auth.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerController),
);

router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginController),
);

router.post('/logout', ctrlWrapper(logoutController));

router.post('/refresh', ctrlWrapper(refreshController));

router.post(
  '/send-reset-email',
  validateBody(requestPasswordResetSchema),
  ctrlWrapper(requestPasswordResetController),
);

router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

router.post('/get-oauth-url', ctrlWrapper(getGoogleOAuthUrlController));

router.post(
  '/confirm-oauth',
  validateBody(confirmGoogleOAuthSchema),
  ctrlWrapper(confirmGoogleOAuthController),
);

export default router;
