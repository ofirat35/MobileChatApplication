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
        IHttpContextAccessor httpContext,
        EventId eventId)
    : GenericRepository<TContext, TEntity, TKey>(dbContext), IBaseService
        where TContext : DbContext
        where TEntity : BaseEntity<TKey>
    {
        protected readonly string _currentUserId = httpContext.GetUserId();
        protected readonly EventId EventId = eventId;

        public async Task<bool> SaveChangesAsync<T>(T? entity, string operation)
            where T : class
        {
            var response = await base.SaveChangesAsync() > 0;
            if (!response)
            {
                logger.DbOperationFailed(eventId, entity, operation, _currentUserId);
                return false;
            }

            return true;
        }

        public void LogDbOperationFailed<T>(T? entity, string operation)
            where T : class
        {
            logger.DbOperationFailed<T>(eventId, entity, operation, _currentUserId);
        }

        public void LogEntityNotFound<T>(string entityId)
           where T : class
        {
            logger.EntityNotFound<T>(eventId, entityId, _currentUserId);
        }

        public void LogError(string? message, params object?[] args)
        {
            logger.LogError(eventId, message, args);
        }

        public void LogWarning(string? message, params object?[] args)
        {
            logger.LogWarning(eventId, message, args);
        }

        public Result<T> SuccessResult<T>(T value, int? statusCode = null)
            => Result<T>.Success(value, statusCode);

        public Result<T> FailResult<T>(string error, int? statusCode = null)
            => Result<T>.Fail(error, statusCode);

    }


    public abstract class BaseService(
        ILogger logger,
        IHttpContextAccessor httpContext,
        EventId eventId) : IBaseService
    {
        protected readonly string _currentUserId = httpContext.GetUserId();
        protected readonly EventId EventId = eventId;

        public void LogDbOperationFailed<T>(T? entity, string operation)
            where T : class
        {
            logger.DbOperationFailed<T>(eventId, entity, operation, _currentUserId);
        }

        public void LogEntityNotFound<T>(string entityId)
           where T : class
        {
            logger.EntityNotFound<T>(eventId, entityId, _currentUserId);
        }

        public void LogError(string? message, params object?[] args)
        {
            logger.LogError(eventId, message, args);
        }

        public void LogWarning(string? message, params object?[] args)
        {
            logger.LogWarning(eventId, message, args);
        }

        public Result<T> SuccessResult<T>(T value, int? statusCode = null)
            => Result<T>.Success(value, statusCode);

        public Result<T> FailResult<T>(string error, int? statusCode = null)
            => Result<T>.Fail(error, statusCode);
    }


    public interface IBaseService
    {
        void LogDbOperationFailed<T>(T? entity, string operation)
           where T : class;
        void LogEntityNotFound<T>(string entityId)
          where T : class;
        void LogError(string? message, params object?[] args);
        void LogWarning(string? message, params object?[] args);
        Result<T> SuccessResult<T>(T value, int? statusCode = null);
        Result<T> FailResult<T>(string error, int? statusCode = null);
    }
}
