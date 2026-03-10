using ChatApp.Core.Application.Repositories;
using ChatApp.Core.Domain.Dtos.AppUsers;
using ChatApp.Core.Domain.Entities;
using ChatApp.Core.Domain.Models;

namespace ChatApp.Core.Application.Services
{
    public interface ISwiperService : IGenericRepository<Swipe, Guid>
    {
        Task<Result<List<UserProfile>>> GetMatchingPreferences(int count, List<string>? ExcludedUserIds);
        Task ClearMatchingPreferencesCache();
        Task<Result<bool>> Like(string id);
        Task<Result<bool>> Pass(string id);
        Task<Result<bool>> ViewProfile(string id);
        //Task<PaginatedItemsViewModel<UserProfile>> GetMatches(int page, int pageSize = 10);
    }
}
