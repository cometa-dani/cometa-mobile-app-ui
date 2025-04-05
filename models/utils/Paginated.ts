export interface IPaginated<T> {
  items: T[];
  nextCursor: number;
  totalItems: number;
  hasNextCursor: boolean;
  itemsPerPage: number;
}
