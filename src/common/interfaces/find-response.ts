import { Pagination } from './pagination';

export interface FindResponse<T> {
  data: T[];
  pagination: Pagination;
}
