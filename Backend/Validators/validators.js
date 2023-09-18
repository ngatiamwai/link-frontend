const joi = require('joi');

const loginSchema = joi.object({
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Invalid email format',
      'any.required': 'Email is required',
    }),
  password: joi.string().required().messages({
    'string.empty': 'Password is required',
    'any.required': 'Password is required',
  }),
});

const registerSchema = joi.object({
  name: joi.string().required(),
  username: joi
    .string()
    .min(3)
    .required()
    .custom((value, helpers) => {
      if (value.includes('@')) {
        return helpers.message('Username cannot contain "@" character');
      }
      return value;
    }, 'custom validation')
    .messages({
      'string.empty': 'Username is required',
      'string.min': 'Username must be at least 3 characters long',
      'custom.custom': 'Username cannot contain "@" character',
      'any.required': 'Username is required',
    }),
  email: joi
    .string()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Invalid email format',
      'any.required': 'Email is required',
    }),
  password: joi
    .string()
    .min(8)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters long',
      'any.required': 'Password is required',
    }),
  phone_number: joi.string().required().messages({
    'string.empty': 'Phone number is required',
    'any.required': 'Phone number is required',
  }),
});

module.exports = {
  loginSchema,
  registerSchema,
};
