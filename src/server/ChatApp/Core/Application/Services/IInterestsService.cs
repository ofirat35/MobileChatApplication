using ChatApp.Core.Domain.Dtos.AppUsers;
using ChatApp.Core.Domain.Models;

namespace ChatApp.Core.Application.Services
{
    public interface IUserProfileService
    {
        Task<PaginatedItemsViewModel<InterestedUserProfile>> GetInterestedUserProfiles(int page, int pageSize);
        Task<Result<InterestedUserProfile>> GetUserProfile(string userId);
    }
}
