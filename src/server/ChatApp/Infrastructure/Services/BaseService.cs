using ChatApp.Core.Application.Extensions;
using ChatApp.Core.Application.Repositories;
using ChatApp.Core.Domain.Entities;
using ChatApp.Core.Domain.Models;
using ChatApp.Extensions;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Infrastructure.Services
{
    public abstract class BaseService<TContext, TEntity, TKey>(
    TContext dbContext,
    ILogger logger,
    IHttpContextAccessor httpContext)
    : GenericRepository<TContext, TEntity, TKey>(dbContext)
    where TContext : DbContext
    where TEntity : BaseEntity<TKey>
    {
        protected readonly string _currentUserId = httpContext.GetUserId();

        public async Task<bool> SaveChangesAsync<T>(T? entity, string operation)
            where T : class
        {
            var response = await base.SaveChangesAsync() > 0;
            if (!response)
            {
                logger.DbOperationFailed(entity, operation, _currentUserId);
                return false;
            }

            return true;
        }

        public bool EntityExists<T>(T? entity, string entityId)
            where T : notnull
        {
            if (entity is null)
            {
                logger.EntityNotFound<T>(entityId, _currentUserId);
                return false;
            }
            return true;
        }

        public Result<T> SuccessResult<T>(T value, int? statusCode = null)
            => Result<T>.Success(value, statusCode);

        public Result<T> FailResult<T>(string error, int? statusCode = null)
            => Result<T>.Fail(error, statusCode);

    }


    public abstract class BaseService(
        ILogger logger,
        IHttpContextAccessor httpContext)
    {
        protected readonly string _currentUserId = httpContext.GetUserId();

        public bool EntityExists<T>(T? entity, string entityId)
            where T : notnull
        {
            if (entity is null)
            {
                logger.EntityNotFound<T>(entityId, _currentUserId);
                return false;
            }
            return true;
        }

        //public bool HttpErrorLogger<T>(HttpResult<T> result,T? entity, string entityId)
        //    where T : notnull
        //{
        //    if (!result.IsSuccess)
        //    {
        //        logger.EntityNotFound<T>(entityId, _currentUserId);
        //        return false;
        //    }
        //    return true;
        //}




        public Result<T> SuccessResult<T>(T value, int? statusCode = null)
            => Result<T>.Success(value, statusCode);

        public Result<T> FailResult<T>(string error, int? statusCode = null)
            => Result<T>.Fail(error, statusCode);

    }
}
