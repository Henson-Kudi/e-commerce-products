export const ProductStatus = {
  ACTIVE: 1,
  INACTIVE: 2,
  DISCONTINUED: 3,
  PENDING_APPROVAL: 4,
  ARCHIVED: 5,
} as const;

// eslint-disable-next-line
export type ProductStatus = (typeof ProductStatus)[keyof typeof ProductStatus];

export const StockStatus = {
  OUT_OF_STOCK: 1,
  IN_STOCK: 2,
} as const;

// eslint-disable-next-line
export type StockStatus = (typeof StockStatus)[keyof typeof StockStatus];

export const DefaultCurrency = 'AED' as const;
