using ChatApp.Core.Helpers.Consts;

namespace ChatApp.Core.Application.Services
{
    public interface IPresenceService
    {
        Task SetOnline(string userId);
        Task SetBackground(string userId);
        Task<UserPresenceStatus> GetStatus(string userId);
        Task<Dictionary<string, UserPresenceStatus>> GetStatusBatch(IEnumerable<string> userIds);
        Task FlushLastSeenToDb(string userId);
    }
}
