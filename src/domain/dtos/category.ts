import PaginationOptions from '../../utils/types/pagination';

export type CreateCategoryDTO = {
  name: string;
  image?: string;
  createdById: string; // Authorised user
  products?: string[]; // List of product IDs (if you want to connect to some already existing products)
  description?: string;
};

export type UpdateCategoryDTO = {
  name?: string;
  image?: string;
  lastModifiedById: string; // Authorised user
  description?: string;
};

export type FindCategoryFilter = {
  id?: string | string[];
  name?: string;
  createdById?: string | string[];
  lastModifiedById?: string | string[];
  createdAt?: { start?: Date | string | number; end?: Date | string | number };
  updatedAt?: { start?: Date | string | number; end?: Date | string | number };
};

export type FindCategoryOptions = {
  withProducts?: boolean;
};

export type FindCategoryQuery = {
  filter: FindCategoryFilter;
  options?: FindCategoryOptions & PaginationOptions;
};
