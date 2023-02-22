import { BaseEntity } from 'typeorm';

export interface IPagination<T> {
  items: T[] | BaseEntity[];
  meta: any;
  links: any;
}
