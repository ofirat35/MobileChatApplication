using ChatApp.Core.Domain.Dtos.AppUsers;
using ChatApp.Core.Domain.Dtos.Preferences;
using ChatApp.Core.Domain.Models;
using ChatApp.Infrastructure.Data;

namespace ChatApp.Core.Application.Services
{
    public interface IAppUserService
    {
        public ChatAppDbContext DbContext { get; }
        Task<Result<AppUserListDto>> GetAppUserByIdAsync(string id);
        Task<Result<bool>> UpdateAppUserAsync(AppUserUpdateDto user);
        Task<Result<bool>> DeleteAppUserAsync(string id);
        Task<Result<bool>> CreateAppUserAsync(AppUserCreateDto user);
        Task<Result<bool>> UpdateAppUserPreferencesAsync(PreferenceUpdateDto preference);
        Task<Result<PreferenceListDto>> GetAppUserPreferenceByIdAsync(string id);
    }
}
