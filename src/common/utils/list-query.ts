import {
  ListQuery,
  PaginatedResult,
} from '../interfaces/list-result.interface';

const compareValues = (left: unknown, right: unknown): number => {
  if (left === right) {
    return 0;
  }

  if (left === undefined || left === null) {
    return -1;
  }

  if (right === undefined || right === null) {
    return 1;
  }

  if (typeof left === 'number' && typeof right === 'number') {
    return left - right;
  }

  return String(left).localeCompare(String(right));
};

export function applyListQuery<T extends Record<string, any>>(
  items: T[],
  query: ListQuery,
): T[] | PaginatedResult<T> {
  const { page, limit, sortBy, order = 'asc' } = query;

  const sorted = [...items].sort((left, right) => {
    if (!sortBy) {
      return 0;
    }

    const direction = order === 'desc' ? -1 : 1;
    return compareValues(left[sortBy], right[sortBy]) * direction;
  });

  if (page === undefined && limit === undefined) {
    return sorted;
  }

  const normalizedPage = page && page > 0 ? page : 1;
  const normalizedLimit = limit && limit > 0 ? limit : 10;
  const start = (normalizedPage - 1) * normalizedLimit;

  return {
    total: sorted.length,
    page: normalizedPage,
    limit: normalizedLimit,
    data: sorted.slice(start, start + normalizedLimit),
  };
}
