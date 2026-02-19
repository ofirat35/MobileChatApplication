export type PaginatedItemsViewModel<TEntity> = {
  page: number;
  pageSize: number;
  totalEntities: number;
  hasNext: boolean;
  hasPrevious: boolean;
  data: TEntity[];
};
