namespace ChatApp.Core.Application.Extensions
{
    public static class LoggerMessages
    {
        public const string EntityNotFound = "Entity not found.";
        public const string ValidationFailed = "Validation failed";
        public const string DbOperationFailed = "Database operation failed.";
        public const string UnexpectedException = "Unexpected exception.";
        public const string ConflictException = "Conflict exception.";

    }

    public static class LoggerExtensions
    {


        public static void EntityNotFound<TEntity>(
            this ILogger logger,
            string entityId,
            string? currentUserId = null) where TEntity : notnull
        {
            logger.LogWarning(
                "Entity not found. {@EntityInfo}",
                new
                {
                    EntityType = typeof(TEntity).Name,
                    EntityId = entityId,
                    CurrentUserId = currentUserId
                });
        }

        public static void ValidationFailed<TEntity>(
            this ILogger logger,
            TEntity? entity = null,
            string? currentUserId = null,
            object? details = null) where TEntity : class
        {
            var entityType = entity != null ? entity.GetType().Name : typeof(TEntity).Name;

            logger.LogWarning(
                "Validation failed for {@EntityInfo}",
                new
                {
                    EntityType = entityType,
                    Entity = entity,
                    CurrentUserId = currentUserId,
                    Details = details
                });
        }

        public static void DbOperationFailed<TEntity>(
            this ILogger logger,
            TEntity? entity,
            string operation,
            string? currentUserId = null,
            Exception? ex = null) where TEntity : class
        {
            var entityType = entity != null ? entity.GetType().Name : typeof(TEntity).Name;
            object? entityId = null;

            if (entity != null)
            {
                var prop = entity.GetType().GetProperty("Id");
                if (prop != null)
                    entityId = prop.GetValue(entity);
            }

            var entityInfo = new
            {
                EntityType = entityType,
                EntityId = entityId,
                Operation = operation,
                CurrentUserId = currentUserId
            };

            logger.LogError(ex, "Database operation failed {@EntityInfo}", entityInfo);
        }

        public static void UnexpectedException(
            this ILogger logger,
            Exception ex,
            string? currentUserId = null,
            string? contextInfo = null)
        {
            logger.LogError(
                ex,
                "Unexpected exception. {@ContextInfo}",
                new
                {
                    CurrentUserId = currentUserId,
                    Context = contextInfo
                });
        }
    }
}