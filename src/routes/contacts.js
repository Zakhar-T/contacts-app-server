import { Router } from 'express';

import {
  createContactController,
  getContactByIdController,
  getContactsController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactsSchema,
  updateContactsSchema,
} from '../validation/contacts.js';

const router = Router();

router.get('/', ctrlWrapper(getContactsController));

router.get('/:id', isValidId, ctrlWrapper(getContactByIdController));

router.post(
  '/',
  validateBody(createContactsSchema),
  ctrlWrapper(createContactController),
);

router.patch(
  '/:id',
  isValidId,
  validateBody(updateContactsSchema),
  ctrlWrapper(updateContactController),
);

router.delete('/:id', isValidId, ctrlWrapper(deleteContactController));

export default router;
