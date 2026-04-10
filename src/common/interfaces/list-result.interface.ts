export interface ListQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  total: number;
  page: number;
  limit: number;
  data: T[];
}
