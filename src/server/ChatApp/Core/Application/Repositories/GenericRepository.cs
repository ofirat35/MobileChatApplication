using ChatApp.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace ChatApp.Core.Application.Repositories
{
    public class GenericRepository<TContext, TEntity, TKey>(TContext dbContext) : IGenericRepository<TEntity, TKey>
        where TContext : DbContext
        where TEntity : BaseEntity<TKey>
    {
        protected readonly TContext DbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));

        public virtual async Task<TEntity> AddAsync(TEntity entity)
        {
            await DbContext.Set<TEntity>().AddAsync(entity);
            return entity;
        }

        public virtual Task<List<TEntity>> Get(Expression<Func<TEntity, bool>> filter = null, bool isTracking = false, params Expression<Func<TEntity, object>>[] includes)
        {
            return Get(filter, null, isTracking, includes);
        }

        public virtual async Task<List<TEntity>> Get(Expression<Func<TEntity, bool>> filter = null, Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null, bool isTracking = false, params Expression<Func<TEntity, object>>[] includes)
        {
            IQueryable<TEntity> query = DbContext.Set<TEntity>();
            if (!isTracking)
                query = query.AsNoTracking();

            foreach (Expression<Func<TEntity, object>> include in includes)
            {
                query = query.Include(include);
            }

            if (filter != null)
            {
                query = query.Where(filter);
            }

            if (orderBy != null)
            {
                query = orderBy(query);
            }

            return await query.ToListAsync();
        }

        public virtual IQueryable<TEntity> GetAll(bool isTracking = false)
        {
            var query = DbContext.Set<TEntity>().AsQueryable();
            if (!isTracking)
                query = query.AsNoTracking();

            return DbContext.Set<TEntity>();
        }

        public virtual async Task<TEntity> GetByIdAsync(TKey id, bool isTracking = true, params Expression<Func<TEntity, object>>[] includes)
        {
            IQueryable<TEntity> query = DbContext.Set<TEntity>();
            if (!isTracking)
                query = query.AsNoTracking();

            foreach (Expression<Func<TEntity, object>> include in includes)
            {
                query = query.Include(include);
            }

            return await query.FirstOrDefaultAsync(e => e.Id.Equals(id));
        }

        public virtual async Task<TEntity> GetSingleAsync(Expression<Func<TEntity, bool>> expression, bool isTracking = true, params Expression<Func<TEntity, object>>[] includes)
        {
            IQueryable<TEntity> query = DbContext.Set<TEntity>();
            if (!isTracking)
                query = query.AsNoTracking();

            foreach (Expression<Func<TEntity, object>> include in includes)
            {
                query = query.Include(include);
            }

            return await query.Where(expression).SingleOrDefaultAsync();

        }

        public virtual async Task<bool> DeleteByIdAsync(TKey id)
        {
            var entity = await DbContext.Set<TEntity>().FindAsync(id);
            DbContext.Set<TEntity>().Remove(entity);

            return true;
        }

        public virtual TEntity Update(TEntity entity)
        {
            DbContext.Set<TEntity>().Update(entity);
            return entity;
        }

        public virtual async Task<int> SaveChangesAsync()
        {
            return await DbContext.SaveChangesAsync();
        }

        public virtual int SaveChanges()
        {
            return DbContext.SaveChanges();
        }

        public Task<bool> Exists(TKey id)
        {
            return DbContext.Set<TEntity>().AnyAsync(_ => _.Id.Equals(id));
        }
    }
}
