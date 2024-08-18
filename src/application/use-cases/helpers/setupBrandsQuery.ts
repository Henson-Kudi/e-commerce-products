import moment from 'moment';
import { FindBrandFilter } from '../../../domain/dtos/brand';

export default function setupBrandsQuery(filter: FindBrandFilter) {
  // Get all fields with either string or array
  const query: Record<string, unknown> = {};

  if (filter?.name) {
    query.name = {
      contains: filter.name,
      mode: 'insensitive',
    };
  }

  if (filter?.createdById) {
    query.createdById = Array.isArray(filter.createdById)
      ? { in: filter.createdById }
      : filter.createdById;
  }

  if (filter?.id) {
    query.id = Array.isArray(filter.id) ? { in: filter.id } : filter.id;
  }

  if (filter?.lastModifiedById) {
    query.lastModifiedById = Array.isArray(filter.lastModifiedById)
      ? { in: filter.lastModifiedById }
      : filter.lastModifiedById;
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

  return query;
}
