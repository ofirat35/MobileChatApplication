using ChatApp.Core.Application.Repositories;
using ChatApp.Core.Domain.Dtos.AppUsers;
using ChatApp.Core.Domain.Dtos.Preferences;
using ChatApp.Core.Domain.Entities;
using ChatApp.Core.Domain.Models;

namespace ChatApp.Core.Application.Services
{
    public interface IAppUserService : IGenericRepository<AppUser, string>
    {
        Task<Result<AppUserListDto>> GetAppUserByIdAsync(string id);
        Task<Result<bool>> UpdateAppUserAsync(AppUserUpdateDto user);
        Task<Result<bool>> DeleteAppUserAsync(string id);
        Task<Result<bool>> CreateAppUserAsync(AppUserCreateDto user);
        Task<Result<bool>> UpdateAppUserPreferencesAsync(PreferenceUpdateDto preference);
        Task<Result<PreferenceListDto>> GetAppUserPreferenceByIdAsync(string id);
    }
}
