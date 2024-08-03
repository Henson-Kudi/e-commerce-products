import PaginationOptions from '../../utils/types/pagination';

export type CreateBrandDTO = {
  name: string;
  image: string;
  createdById: string; // Authorised user
  products?: string[]; // List of product IDs (if you want to connect to some already existing products)
  description?: string;
};

export type UpdateBrandDTO = {
  name?: string;
  image?: string;
  lastModifiedById: string; // Authorised user
  description?: string;
};

export type FindBrandFilter = {
  name?: string;
  createdById?: string | string[];
  lastModifiedById?: string | string[];
  createdAt?: { start?: Date | string | number; end?: Date | string | number };
  updatedAt?: { start?: Date | string | number; end?: Date | string | number };
};

export type FindBrandOptions = {
  withProducts?: boolean;
};

export type FindBrandQuery = {
  filter: FindBrandFilter;
  options?: FindBrandOptions & PaginationOptions;
};
