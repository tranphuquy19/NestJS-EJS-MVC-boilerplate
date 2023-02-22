import { Permission } from 'accesscontrol';

import { IPagination } from '@shared';

export function paginateFilter<T>(
  { items, links, meta }: IPagination<T>,
  permission: Permission,
): IPagination<T> {
  const _items = permission.filter(items);
  return {
    items: _items,
    meta,
    links,
  };
}
