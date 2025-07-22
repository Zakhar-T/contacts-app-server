import Joi from 'joi';

export const createContactsSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Username should be a string',
    'string.min': 'Username should have at least 3 charachters',
    'string.max': 'Username should have not more than 20 charachters',
    'any.required': 'Username is required',
  }),
  phoneNumber: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Phone number should be a string',
    'string.min': 'Phone number should have at least 3 charachters',
    'string.max': 'Phone number should have not more than 20 charachters',
    'any.required': 'Phone number is required',
  }),
  email: Joi.string().min(3).max(20).email().messages({
    'string.base': 'Email should be a string',
    'string.min': 'Email should have at least 3 charachters',
    'string.max': 'Email should have not more than 20 charachters',
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .required()
    .messages({
      'string.base': 'Contact type should be a string',
      'any.valid':
        'Contact type should be one of following: "work", "home", "personal"',
      'any.required': 'Phone number is required',
    }),
});

export const updateContactsSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Username should be a string',
    'string.min': 'Username should have at least 3 charachters',
    'string.max': 'Username should have not more than 20 charachters',
  }),
  phoneNumber: Joi.string().min(3).max(20).messages({
    'string.base': 'Phone number should be a string',
    'string.min': 'Phone number should have at least 3 charachters',
    'string.max': 'Phone number should have not more than 20 charachters',
  }),
  email: Joi.string().min(3).max(20).email().messages({
    'string.base': 'Email should be a string',
    'string.min': 'Email should have at least 3 charachters',
    'string.max': 'Email should have not more than 20 charachters',
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal').messages({
    'string.base': 'Contact type should be a string',
    'any.valid':
      'Contact type should be one of following: "work", "home", "personal"',
  }),
});
