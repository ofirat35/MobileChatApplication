namespace ChatApp.Core.Domain.Models
{
    public class PaginatedItemsViewModel<TEntity>
       (int page, int pageSize, long TotalEntities, IEnumerable<TEntity> data) where TEntity : class
    {
        public int Page { get; } = page;
        public int PageSize { get; } = pageSize;
        public long TotalEntities { get; } = TotalEntities;
        public bool HasNext { get => page > 0 && TotalEntities > page * PageSize; }
        public bool HasPrevious { get => page > 1; }
        public IEnumerable<TEntity> Data { get; } = data;
    }
}
