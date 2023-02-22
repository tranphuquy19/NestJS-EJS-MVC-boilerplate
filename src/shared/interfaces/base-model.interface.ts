export type IBaseModel<T> = T & {
  type: string;
  insertType(): void;
};
