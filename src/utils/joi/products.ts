import Joi from 'joi';
import {
  DefaultCurrency,
  ProductStatus,
  StockStatus,
} from '../../domain/constants';
import { DiscountType } from '../../domain/dtos/product';
import { DiscountStrategy } from '../types/others';

const stringValidation = Joi.string()
  .regex(/^[a-zA-Z0-9][a-zA-Z0-9 _-]*$/)
  .required()
  .messages({
    'string.base': `"name" should be a type of 'text'`,
    'string.empty': `"name" cannot be an empty field`,
    'string.pattern.base': `"name" must only contain letters, numbers, spaces, underscores, or hyphens and must not start with a space, underscore, or hyphen`,
    'any.required': `"name" is a required field`,
  });

const CreateProduct = Joi.object({
  name: stringValidation,
  description: Joi.string().optional().allow(null).allow(''),
  // price: Joi.number().required().min(0),
  currency: Joi.string().optional().default(DefaultCurrency),
  brandId: Joi.string().uuid().optional(),
  brand: Joi.object({
    name: Joi.string().required(),
    image: Joi.string().optional().allow(null).allow(''),
    description: Joi.string().optional().allow(null).allow(''),
  }),
  categories: Joi.array().items(Joi.string().uuid()).required(),
  tags: Joi.array().items(Joi.string().min(1)).optional().allow(null),
  SKU: Joi.string().optional(),
  UPC: Joi.string().optional().allow(null).allow(''),
  EAN: Joi.string().optional().allow(null).allow(''),
  media: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().required(),
        type: Joi.string().required(),
        altText: Joi.string().optional(),
      })
    )
    .min(1)
    .optional(),
  createdById: Joi.string().required(),
  status: Joi.number()
    .valid(...Object.values(ProductStatus))
    .optional()
    .allow(null),
  stockStatus: Joi.number()
    .valid(...Object.values(StockStatus))
    .optional()
    .allow(null),
  metaTitle: Joi.string().optional().allow(null).allow(''),
  metaDescription: Joi.string().optional().allow(null).allow(''),
  metaKeywords: Joi.array().items(Joi.string().min(1)).optional().allow(null),
  qtyInStock: Joi.number().required().min(0),
  originalPrice: Joi.number().required().min(0),
  // discountedPrice: Joi.number().optional().min(0),
  // discountStartDate: Joi.date().optional().allow(null).allow(''),
  // discountEndDate: Joi.date().optional().allow(null).allow(''),
  unit: Joi.string().required(),
  size: Joi.string().optional().allow(null).allow(''),
  color: Joi.string().optional().allow(null).allow(''),
  weight: Joi.string().optional().allow(null).allow(''),
  dimensions: Joi.string().optional().allow(null).allow(''),
  attributes: Joi.object().optional().allow(null),
  taxes: Joi.array().items(Joi.string().uuid()).optional().allow(null),
  discount: Joi.object({
    name: stringValidation,
    type: Joi.valid(...[DiscountType.PERCENTAGE, DiscountType.FIXED_AMOUNT], {
      message: 'Invalid discount type.',
    }),
    value: Joi.number().positive(),
    startDate: Joi.string(),
    endDate: Joi.string(),
  })
    .optional()
    .allow(null),
}).xor('brandId', 'brand');
// xor ensures you pass only one of 2 fields (not both)

const UpdateProduct = Joi.object({
  id: Joi.string().uuid().required(),
  name: Joi.string()
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9 _-]*$/)
    .optional()
    .messages({
      'string.base': `"name" should be a type of 'text'`,
      'string.empty': `"name" cannot be an empty field`,
      'string.pattern.base': `"name" must only contain letters, numbers, spaces, underscores, or hyphens and must not start with a space, underscore, or hyphen`,
      'any.required': `"name" is a required field`,
    }),
  description: Joi.string().optional(),
  price: Joi.number().optional().min(0),
  currency: Joi.string().optional(),
  brandId: Joi.string().uuid().optional(),
  categories: Joi.array().items(Joi.string().uuid()).optional(),
  tags: Joi.array().items(Joi.string().min(1)).optional().allow(null).allow(''),
  SKU: Joi.string().optional().allow(null).allow(''),
  UPC: Joi.string().optional().allow(null).allow(''),
  EAN: Joi.string().optional().allow(null).allow(''),
  media: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().optional(),
        type: Joi.string().optional(),
        altText: Joi.string().optional(),
      })
    )
    .min(1)
    .optional(),

  lastModifiedById: Joi.string().uuid().required(), // Person performing the update is required
  status: Joi.number()
    .valid(...Object.values(ProductStatus))
    .optional(),
  stockStatus: Joi.number()
    .valid(...Object.values(StockStatus))
    .optional(),
  metaTitle: Joi.string().optional().allow(null).allow(''),
  metaDescription: Joi.string().optional().allow(null).allow(''),
  metaKeywords: Joi.array()
    .items(Joi.string().min(1))
    .optional()
    .allow(null)
    .allow(''),
  qtyInStock: Joi.number().optional().min(0),
  originalPrice: Joi.number().optional().min(0),
  taxes: Joi.array().items(Joi.string().uuid()).optional(),
  // discountedPrice: Joi.number().optional().min(0),
  // discountStartDate: Joi.date().optional(),
  // discountEndDate: Joi.date().optional(),
  unit: Joi.string().optional(),
  size: Joi.string().optional(),
  color: Joi.string().optional().allow(null).allow(''),
  weight: Joi.string().optional().allow(null).allow(''),
  dimensions: Joi.string().optional().allow(null).allow(''),
  attributes: Joi.object()
    .pattern(Joi.string(), Joi.string())
    .optional()
    .messages({
      'object.base': `"attributes" should be an object`,
      'object.pattern.base': `"attributes" should have keys of type 'string' and values of type 'string'`,
    }),
});

// products discount
const CreateProductDiscount = Joi.object({
  productIds: Joi.array().items(Joi.string().uuid()).min(1).required(),
  discountId: Joi.string().uuid().optional().allow('').allow(null),
  discountType: Joi.string()
    .valid(...Object.values(DiscountType))
    .required(),
  discountName: Joi.string().optional().allow('').allow(null),
  discountValue: Joi.number().required().positive(),
  isActive: Joi.boolean().optional(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  autoApply: Joi.boolean().optional(),
  actor: Joi.string().optional().allow('').allow(null),
  strategy: Joi.string()
    .valid(...Object.values(DiscountStrategy))
    .required(),
});

export function validateCreateProduct(
  product: unknown,
  options: Joi.AsyncValidationOptions = { abortEarly: false }
) {
  return CreateProduct.validateAsync(product, options);
}

export function validateUpdateProduct(
  product: unknown,
  options: Joi.AsyncValidationOptions = { abortEarly: false }
) {
  return UpdateProduct.validateAsync(product, options);
}

export function validateCreateProductDiscount(data: unknown) {
  return CreateProductDiscount.validateAsync(data, { abortEarly: false });
}
