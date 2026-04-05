using ChatApp.Core.Application.Services;
using ChatApp.Core.Helpers.Consts;

namespace ChatApp.Infrastructure.Services
{
    public class PresenceService(
        IAppCacheService cacheService,
        IAppUserService userService) : IPresenceService
    {
        private const int PRESENCE_TTL_SECONDS = 60;

        public async Task SetOnline(string userId)
        {
            var key = GetPresenceCacheKey(userId);
            await cacheService.SetAsync(key, UserPresenceStatus.Online, TimeSpan.FromSeconds(PRESENCE_TTL_SECONDS));

            // Notify subscribers (other server instances)
            //await _pubSub.PublishAsync("presence:changed", $"{userId}:online");
        }

        public async Task SetBackground(string userId)
        {
            var key = GetPresenceCacheKey(userId);
            await cacheService.SetAsync(key, UserPresenceStatus.Background, TimeSpan.FromSeconds(PRESENCE_TTL_SECONDS));


            //  await _pubSub.PublishAsync("presence:changed", $"{userId}:background");
        }

        public async Task<UserPresenceStatus> GetStatus(string userId)
        {
            var status = await cacheService.GetAsync<UserPresenceStatus?>(GetPresenceCacheKey(userId));
            if (!status.HasValue) return UserPresenceStatus.Offline;

            return status.Value;
        }

        public async Task<Dictionary<string, UserPresenceStatus>> GetStatusBatch(IEnumerable<string> userIds)
        {
            var statuses = new Dictionary<string, UserPresenceStatus>();
            foreach (var userId in userIds)
                statuses.Add(userId,
                    (await cacheService.GetAsync<UserPresenceStatus?>(GetPresenceCacheKey(userId)))
                    ?? UserPresenceStatus.Offline);

            return statuses;
        }

        public async Task FlushLastSeenToDb(string userId)
        {
            await userService.UpdateLastSeenAsync(userId, DateTime.UtcNow);
        }

        private string GetPresenceCacheKey(string userId) => $"presence:{userId}";
    }
}
