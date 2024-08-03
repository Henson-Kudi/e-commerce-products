import Joi from 'joi';

const CreateBrand = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional().allow(null).allow(''),
  image: Joi.string().required(),
  createdById: Joi.string().required(),
  products: Joi.array().items(Joi.string().uuid()).optional(),
});

const UpdateBrand = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  image: Joi.string().optional(),
  lastModifiedById: Joi.string().required(),
  id: Joi.string().uuid().required(),
});

export function validateCreateBrand(
  data: unknown,
  options: Joi.AsyncValidationOptions = { abortEarly: false }
) {
  return CreateBrand.validateAsync(data, options);
}

export function validateUpdateBrand(
  product: unknown,
  options: Joi.AsyncValidationOptions = { abortEarly: false }
) {
  return UpdateBrand.validateAsync(product, options);
}
