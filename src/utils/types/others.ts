export type CombinedPermission = {
  userLevel: string;
  groupLevel: string;
  allLevel: string;
};

export type NonEmptyArray<T> = [T, ...T[]];

export type KafkaMessageControllerHandler<T> = (data: T) => Promise<any>;

export const DiscountStrategy = {
  OVERRIDE: 'OVERRIDE',
  STACK: 'STACK',
  SKIP_EXISTING: 'SKIP_EXISTING',
};
export type DiscountStrategy =
  (typeof DiscountStrategy)[keyof typeof DiscountStrategy];
