export interface EntityResults<T> {
  count: number;
  entities: T[];
  nestedItemsCount?: number;
  totalNestedCount?: number;
}
