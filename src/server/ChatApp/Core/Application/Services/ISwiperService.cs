using ChatApp.Core.Application.Repositories;
using ChatApp.Core.Domain.Dtos.AppUsers;
using ChatApp.Core.Domain.Entities;
using ChatApp.Core.Domain.Models;

namespace ChatApp.Core.Application.Services
{
    public interface ISwiperService : IGenericRepository<Swipe, Guid>
    {
        Task<Result<List<AppUserListDto>>> GetMatchingPreferences(int count, List<string>? ExcludedUserIds);
        Task ClearMatchingPreferencesCache();
        Task<Result<bool>> Like(string id);
        Task<Result<bool>> Pass(string id);
        Task<Result<bool>> ViewProfile(string id);
        Task<Result<bool>> RemoveSwipesAsync(string userId1, string userId2);
    }
}
