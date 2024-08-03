import Joi from 'joi';

const CreateTax = Joi.object({
  name: Joi.string().required(),
  rate: Joi.number().min(0).max(100).required(),
  createdById: Joi.string().required(),
  products: Joi.array().items(Joi.string().uuid()).optional(),
  description: Joi.string().optional().allow(null).allow(''),
});

const UpdateTax = Joi.object({
  name: Joi.string().optional(),
  rate: Joi.number().min(0).max(100).optional(),
  products: Joi.array().items(Joi.string().uuid()).optional(),
  description: Joi.string().optional(),
  lastModifiedById: Joi.string().required(),
  id: Joi.string().uuid().required(),
});

export function validateCreateTax(
  product: unknown,
  options: Joi.AsyncValidationOptions = { abortEarly: false }
) {
  return CreateTax.validateAsync(product, options);
}

export function validateUpdateTax(
  product: unknown,
  options: Joi.AsyncValidationOptions = { abortEarly: false }
) {
  return UpdateTax.validateAsync(product, options);
}
