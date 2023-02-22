import { EntityResults, IPagination, PaginateParams } from '@shared';

export function customPaginate<T>(
  { entities, count, totalNestedCount, nestedItemsCount }: EntityResults<any>,
  { route, order, limit, page }: PaginateParams,
): IPagination<T> {
  const entitiesLength = entities.length;
  const totalPages = Math.ceil(count / limit) || 1;
  const pPrevious = page - 1;
  const pNext = page + 1;
  return {
    items: entities,
    links: {
      first: `${route}?page=1&limit=${limit}&order=${order}`,
      previous: `${
        page <= 1
          ? ''
          : `${route}?page=${
              pPrevious <= totalPages ? pPrevious : totalPages
            }&limit=${limit}&order=${order}`
      }`,
      next: `${
        page >= totalPages
          ? ''
          : `${route}?page=${
              pNext > totalPages ? totalPages : pNext
            }&limit=${limit}&order=${order}`
      }`,
      last: `${route}?page=${totalPages}&limit=${limit}&order=${order}`,
    },
    meta: {
      totalItems: totalNestedCount || count,
      itemCount: nestedItemsCount || entitiesLength,
      itemsPerPage: nestedItemsCount ? limit * 3 : limit,
      totalPages,
      currentPage: page,
    },
  };
}
