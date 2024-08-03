import PaginationOptions from '../../utils/types/pagination';
import { ProductStatus, StockStatus } from '../constants';
import { NonEmptyArray } from '../../utils/types/others';
import { CreateBrandDTO } from './brand';
import { Prisma } from '@prisma/client';

// JUST A NOTE ON PRODUCTS. WE WOULD USE CRON JOBS AND WEBSOCKETS TO MANAGE DISCOUNT CHANGES TO PRODUCT. WHEN DISCOUNT IS ADDEDD ON A PRODUCT, SCHEDULE A CRON JOB THAT WOULD RUN ON THE START DATE OF THE DISCOUNT TO UPDATE THE PRICE OF THE PRODUCT TO A DISCOUNTED PRICE. ALSO SCHEDULE ANOTHER JOB TO REVER THE DISCOUNT ON THE END DATE OF THE DISCOUNT BACK TO ORIGINAL PRICE OF THE PRODUCT.
// ONCE DISCOUNT IS UPDATED, FRONTEND NEED TO BE UPDATED VIA WEBSOCKETS

export type ProductMediaType = {
  url: string;
  type: 'VIDEO' | 'IMAGE'; // Product media should accept only images  or videos
  altText: string;
};

export type CreateProductDTO = {
  name: string; //Product names need to be unique (not null)
  description?: string;
  price: number;
  currency: string;
  brandId?: string;
  brand?: Omit<CreateBrandDTO, 'prducts'>; // In order to create a product you must pass at least one (either an existing brandId or create a new brand while creating a new product)
  categories?: string[]; //IDs of categories to which the product belongs to. This is a many to many relationship
  tags?: string[];
  SKU: string;
  UPC?: string;
  EAN?: string;
  media: NonEmptyArray<ProductMediaType>;
  createdById: string;
  status?: ProductStatus;
  stockStatus?: StockStatus;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  qtyInStock: number;
  originalPrice: number;
  taxes?: string[]; // list of tax IDs
  discountedPrice?: number;
  discountStartDate?: Date | string | number;
  discountEndDate?: Date | string | number;
  averageRating?: number;
  reviewCount?: number;
  unit: string;
  size?: string;
  color?: string;
  weight?: string;
  dimensions?: string;
  attributes?: Record<string, string>; //Additional attributes of the product
};

export type UpdateProductDTO = Omit<
  Prisma.ProductUncheckedUpdateInput,
  'taxes' | 'categories' | 'slug'
> & {
  id: string;
  attributes?: Record<string, string>; // Existing data would be overidden
  taxes?: string[]; // list of tax IDs. This would extend existing data
  lastModifiedById: string;
  media?: NonEmptyArray<ProductMediaType>; // Existing media would be overidden
  categories?: string[]; //Overides existing
};

export type FindProductFilter = {
  id: string | string[];
  name?: string; //Product names need to be unique (not null)
  price?: { min?: number; max?: number };
  currency?: string | string[];
  brandId?: string | string[];
  categories?: string | string[];
  taxes?: string | string[];
  tags?: string | string[];
  SKU?: string | string[];
  UPC?: string | string[];
  EAN?: string | string[];
  createdAt?: { start?: Date | string | number; end?: Date | string | number };
  updatedAt?: { start?: Date | string | number; end?: Date | string | number };
  createdBy?: string | string[];
  status?: ProductStatus | ProductStatus[];
  stockStatus?: StockStatus | StockStatus[];
  qtyInStock: { min?: number; max?: number };
  originalPrice: { min?: number; max?: number };
  discountedPrice?: { min?: number; max?: number };
  discountStartDate?: {
    start?: Date | string | number;
    end?: Date | string | number;
  };
  discountEndDate?: {
    start?: Date | string | number;
    end?: Date | string | number;
  };
  averageRating?: { min?: number; max?: number };
  reviewCount?: { min?: number; max?: number };
  unit: string | string[];
  size?: string | string[];
  color?: string | string[];
  weight?: string | string[];
  dimensions?: string | string[];
};

export type FindProductOptions = {
  withBrand?: boolean;
  withCategories?: boolean;
  withTaxes?: boolean;
};

export type FindProductQuery = {
  filter: FindProductFilter;
  options?: FindProductOptions & PaginationOptions;
};
