namespace ChatApp.Core.Application.Extensions
{
   
    public static class LoggerExtensions
    {


        public static void EntityNotFound<TEntity>(
            this ILogger logger,
            EventId eventId,
            string entityId,
            string? currentUserId = null) where TEntity : notnull
        {
            logger.LogWarning(
                eventId,
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
            EventId eventId,
            TEntity? entity = null,
            string? currentUserId = null,
            object? details = null) where TEntity : class
        {
            var entityType = entity != null ? entity.GetType().Name : typeof(TEntity).Name;

            logger.LogWarning(
                eventId,
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
            EventId eventId,
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

            logger.LogError(eventId, ex, "Database operation failed {@EntityInfo}", entityInfo);
        }

        public static void UnexpectedException(
            this ILogger logger,
            EventId eventId,
            Exception ex,
            string? currentUserId = null,
            string? contextInfo = null)
        {
            logger.LogError(
                eventId,
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