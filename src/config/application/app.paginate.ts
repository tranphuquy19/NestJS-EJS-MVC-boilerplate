/**
 * Limit the number of items per page
 */
export const pLimit: number = parseInt(process.env.MAX_ITEMS_PER_PAGE);

/**
 * The order of the items. Default values: `ASC`, `DESC`
 */
export const pOrder: string = process.env.ITEMS_ORDER;
