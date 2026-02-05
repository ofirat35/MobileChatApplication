using ChatApp.Core.Application.Services;
using Microsoft.Extensions.Caching.Memory;

namespace ChatApp.Infrastructure.Services
{
    public class InMemoryCacheService(IMemoryCache cache) : IAppCacheService
    {
        public Task<T?> GetAsync<T>(string key)
        {
            cache.TryGetValue(key, out T value);
            return Task.FromResult(value);
        }

        public Task SetAsync<T>(string key, T value, TimeSpan? expiration = null)
        {
            cache.Set(key, value, expiration ?? TimeSpan.FromMinutes(5));
            return Task.CompletedTask;
        }

        public Task RemoveAsync(string key)
        {
            cache.Remove(key);
            return Task.CompletedTask;
        }
    }
}
