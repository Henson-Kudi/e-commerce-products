import ErrorClass from './error';

export default interface IReturnValue<Data = unknown> {
  success: boolean;
  message?: string;
  data?: Data;
  error?: ErrorClass;
}

export interface IReturnValueWithPagination<Data = unknown> {
  success: boolean;
  message?: string;
  data?: {
    data: Data;
    limit: number;
    total: number;
    page: number;
  };
  error?: ErrorClass;
}
