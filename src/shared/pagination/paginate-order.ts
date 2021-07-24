import { EnumOrder, IPagination } from '@shared';

function addOrderQuery(links: any, order: EnumOrder): any {
    const _links = {};
    Object.keys(links).forEach((pageName) => {
        const pageData = links[pageName];
        _links[pageName] = pageData ? `${pageData}&order=${order}` : '';
    });
    return _links;
}

export function paginateOrder<T>({ items, links, meta }, order: EnumOrder): IPagination<T> {
    return {
        items,
        meta,
        links: addOrderQuery(links, order),
    };
}
