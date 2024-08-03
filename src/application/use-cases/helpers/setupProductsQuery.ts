import moment from 'moment';
import { FindProductFilter } from '../../../domain/dtos/product';

export default function setupProductsQuery(filter: FindProductFilter) {
  // Get all fields with either string or array
  const query: Record<string, unknown> = {};

  if (filter?.name) {
    query.name = {
      contains: filter.name,
      mode: 'insensitive',
    };
  }

  if (filter?.price) {
    const price: Record<string, unknown> = {};
    if (filter.price.min && filter.price.min > 0) {
      price.gte = filter.price.min;
    }
    if (filter.price.max && filter.price.max > 0) {
      price.lte = filter.price.max;
    }

    Object.keys(price).length && (query.price = price);
  }
  if (filter?.originalPrice) {
    const originalPrice: Record<string, unknown> = {};
    if (filter.originalPrice.min && filter.originalPrice.min > 0) {
      originalPrice.gte = filter.originalPrice.min;
    }
    if (filter.originalPrice.max && filter.originalPrice.max > 0) {
      originalPrice.lte = filter.originalPrice.max;
    }

    Object.keys(originalPrice).length && (query.originalPrice = originalPrice);
  }
  if (filter?.discountedPrice) {
    const discountedPrice: Record<string, unknown> = {};
    if (filter.discountedPrice.min && filter.discountedPrice.min > 0) {
      discountedPrice.gte = filter.discountedPrice.min;
    }
    if (filter.discountedPrice.max && filter.discountedPrice.max > 0) {
      discountedPrice.lte = filter.discountedPrice.max;
    }

    Object.keys(discountedPrice).length &&
      (query.discountedPrice = discountedPrice);
  }
  if (filter?.qtyInStock) {
    const qtyInStock: Record<string, unknown> = {};
    if (filter.qtyInStock.min && filter.qtyInStock.min > 0) {
      qtyInStock.gte = filter.qtyInStock.min;
    }
    if (filter.qtyInStock.max && filter.qtyInStock.max > 0) {
      qtyInStock.lte = filter.qtyInStock.max;
    }

    Object.keys(qtyInStock).length && (query.qtyInStock = qtyInStock);
  }
  if (filter?.reviewCount) {
    const reviewCount: Record<string, unknown> = {};
    if (filter.reviewCount.min && filter.reviewCount.min > 0) {
      reviewCount.gte = filter.reviewCount.min;
    }
    if (filter.reviewCount.max && filter.reviewCount.max > 0) {
      reviewCount.lte = filter.reviewCount.max;
    }

    Object.keys(reviewCount).length && (query.reviewCount = reviewCount);
  }
  if (filter?.averageRating) {
    const averageRating: Record<string, unknown> = {};
    if (filter.averageRating.min && filter.averageRating.min > 0) {
      averageRating.gte = filter.averageRating.min;
    }
    if (filter.averageRating.max && filter.averageRating.max > 0) {
      averageRating.lte = filter.averageRating.max;
    }
    Object.keys(averageRating).length && (query.averageRating = averageRating);
  }
  if (filter?.currency) {
    query.currency = Array.isArray(filter.currency)
      ? { in: filter.currency, mode: 'insensitive' }
      : { equals: filter.currency, mode: 'insensitive' };
  }

  if (filter?.id) {
    query.id = Array.isArray(filter.id)
      ? { in: filter.id }
      : { equals: filter.id };
  }

  if (filter?.brandId) {
    query.brandId = Array.isArray(filter.brandId)
      ? { in: filter.brandId }
      : { equals: filter.brandId };
  }
  if (filter?.categories) {
    query.categories = {
      some: {
        id: Array.isArray(filter.categories)
          ? { in: filter.categories }
          : filter.categories,
      },
    };
  }
  if (filter?.taxes) {
    query.taxes = {
      some: {
        id: Array.isArray(filter.taxes) ? { in: filter.taxes } : filter.taxes,
      },
    };
  }
  if (filter?.createdBy) {
    query.createdById = Array.isArray(filter.createdBy)
      ? { in: filter.createdBy }
      : { equals: filter.createdBy };
  }
  if (filter?.status) {
    query.status = Array.isArray(filter.status)
      ? { in: filter.status }
      : { equals: filter.status };
  }
  if (filter?.stockStatus) {
    query.stockStatus = Array.isArray(filter.stockStatus)
      ? { in: filter.stockStatus }
      : { equals: filter.stockStatus };
  }
  if (filter?.tags) {
    query.tags = Array.isArray(filter.tags)
      ? { hasSome: filter.tags }
      : { has: filter.tags };
  }
  if (filter?.SKU) {
    query.SKU = Array.isArray(filter.SKU)
      ? { in: filter.SKU, mode: 'insensitive' }
      : { equals: filter.SKU, mode: 'insensitive' };
  }
  if (filter?.EAN) {
    query.EAN = Array.isArray(filter.EAN)
      ? { in: filter.EAN, mode: 'insensitive' }
      : { equals: filter.EAN, mode: 'insensitive' };
  }
  if (filter?.UPC) {
    query.UPC = Array.isArray(filter.UPC)
      ? { in: filter.UPC, mode: 'insensitive' }
      : { equals: filter.UPC, mode: 'insensitive' };
  }
  if (filter?.size) {
    query.size = Array.isArray(filter.size)
      ? { in: filter.size, mode: 'insensitive' }
      : { equals: filter.size, mode: 'insensitive' };
  }
  if (filter?.unit) {
    query.unit = Array.isArray(filter.unit)
      ? { in: filter.unit, mode: 'insensitive' }
      : { equals: filter.unit, mode: 'insensitive' };
  }
  if (filter?.color) {
    query.color = Array.isArray(filter.color)
      ? { in: filter.color, mode: 'insensitive' }
      : { equals: filter.color, mode: 'insensitive' };
  }
  if (filter?.weight) {
    query.weight = Array.isArray(filter.weight)
      ? { in: filter.weight, mode: 'insensitive' }
      : { equals: filter.weight, mode: 'insensitive' };
  }
  if (filter?.dimensions) {
    query.dimensions = Array.isArray(filter.dimensions)
      ? { in: filter.dimensions, mode: 'insensitive' }
      : { equals: filter.dimensions, mode: 'insensitive' };
  }

  if (filter?.createdAt) {
    const createdAt: Record<string, unknown> = {};
    if (
      filter.createdAt.start &&
      moment.isDate(new Date(filter.createdAt.start))
    ) {
      createdAt.gte = moment(filter.createdAt.start).toDate(); // Convert to Date
    }
    if (filter.createdAt.end && moment.isDate(new Date(filter.createdAt.end))) {
      createdAt.lte = moment(filter.createdAt.end).toDate(); // Convert to Date
    }
    Object.keys(createdAt).length && (query.createdAt = createdAt);
  }
  if (filter?.updatedAt) {
    const updatedAt: Record<string, unknown> = {};
    if (
      filter.updatedAt.start &&
      moment.isDate(new Date(filter.updatedAt.start))
    ) {
      updatedAt.gte = moment(filter.updatedAt.start).toDate(); // Convert to Date
    }
    if (filter.updatedAt.end && moment.isDate(new Date(filter.updatedAt.end))) {
      updatedAt.lte = moment(filter.updatedAt.end).toDate(); // Convert to Date
    }
    Object.keys(updatedAt).length && (query.updatedAt = updatedAt);
  }
  if (filter?.discountStartDate) {
    const discountStartDate: Record<string, unknown> = {};
    if (
      filter.discountStartDate.start &&
      moment.isDate(new Date(filter.discountStartDate.start))
    ) {
      discountStartDate.gte = moment(filter.discountStartDate.start).toDate(); // Convert to Date
    }
    if (
      filter.discountStartDate.end &&
      moment.isDate(new Date(filter.discountStartDate.end))
    ) {
      discountStartDate.lte = moment(filter.discountStartDate.end).toDate(); // Convert to Date
    }
    Object.keys(discountStartDate).length &&
      (query.discountStartDate = discountStartDate);
  }
  if (filter?.discountEndDate) {
    const discountEndDate: Record<string, unknown> = {};
    if (
      filter.discountEndDate.start &&
      moment.isDate(new Date(filter.discountEndDate.start))
    ) {
      discountEndDate.gte = moment(filter.discountEndDate.start).toDate(); // Convert to Date
    }
    if (
      filter.discountEndDate.end &&
      moment.isDate(new Date(filter.discountEndDate.end))
    ) {
      discountEndDate.lte = moment(filter.discountEndDate.end).toDate(); // Convert to Date
    }
    Object.keys(discountEndDate).length &&
      (query.discountEndDate = discountEndDate);
  }

  return query;
}
