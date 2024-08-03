export type CombinedPermission = {
  userLevel: string;
  groupLevel: string;
  allLevel: string;
};

export type NonEmptyArray<T> = [T, ...T[]];
