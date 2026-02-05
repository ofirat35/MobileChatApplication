using System.Linq.Expressions;

namespace ChatApp.Core.Application.Repositories
{
    public interface IGenericRepository
        <TEntity, TKey> where TEntity : class
    {
        IQueryable<TEntity> GetAll(bool isTracking = false);
        Task<List<TEntity>> Get(Expression<Func<TEntity, bool>> filter = null, Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null, bool isTracking = false, params Expression<Func<TEntity, object>>[] includes);
        Task<List<TEntity>> Get(Expression<Func<TEntity, bool>> filter = null, bool isTracking = false, params Expression<Func<TEntity, object>>[] includes);
        Task<TEntity> GetByIdAsync(TKey id, bool isTracking = true, params Expression<Func<TEntity, object>>[] includes);
        Task<TEntity> GetSingleAsync(Expression<Func<TEntity, bool>> expression, bool isTracking = true, params Expression<Func<TEntity, object>>[] includes);
        Task<bool> Exists(TKey id);
        Task<TEntity> AddAsync(TEntity entity);
        TEntity Update(TEntity entity);
        Task<bool> DeleteByIdAsync(TKey id);
        Task<int> SaveChangesAsync();
        int SaveChanges();
    }
}
