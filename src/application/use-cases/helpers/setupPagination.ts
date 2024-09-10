import PaginationOptions from '../../../utils/types/pagination';

export default function setupPagination(params: PaginationOptions): {
  page: number;
  limit: number;
  skip: number;
} {
  const page = params.page && params.page > 0 ? Number(params.page) : 1;
  const limit = params.limit && params.limit > 0 ? Number(params.limit) : 10;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}
