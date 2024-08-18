import PaginationOptions from '../../utils/types/pagination';

export type CreateTaxDTO = {
  name: string;
  rate: number;
  createdById: string; // Authorised user
  products?: string[]; // List of product IDs (if you want to connect to some already existing products)
  description?: string;
};

export type UpdateTaxDTO = {
  name?: string;
  rate?: number;
  lastModifiedById: string; // Authorised user
  description?: string;
};

export type FindTaxFilter = {
  id?: string | string[];
  name?: string;
  rate?: { min?: number; max?: number };
  createdById?: string | string[];
  lastModifiedById?: string | string[];
  createdAt?: { start?: Date | string | number; end?: Date | string | number };
  updatedAt?: { start?: Date | string | number; end?: Date | string | number };
};

export type FindTaxOptions = {
  withProducts?: boolean;
};

export type FindTaxQuery = {
  filter: FindTaxFilter;
  options?: FindTaxOptions & PaginationOptions;
};
