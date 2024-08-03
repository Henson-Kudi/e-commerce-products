import Joi from 'joi';

const CreateCatefory = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  image: Joi.string().required(),
  createdById: Joi.string().required(),
});

const UpdateCategory = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  image: Joi.string().optional(),
  lastModifiedById: Joi.string().required(),
  id: Joi.string().required(),
});

export function validateCreateCategory(
  product: unknown,
  options: Joi.AsyncValidationOptions = { abortEarly: false }
) {
  return CreateCatefory.validateAsync(product, options);
}

export function validateUpdateCategory(
  product: unknown,
  options: Joi.AsyncValidationOptions = { abortEarly: false }
) {
  return UpdateCategory.validateAsync(product, options);
}
