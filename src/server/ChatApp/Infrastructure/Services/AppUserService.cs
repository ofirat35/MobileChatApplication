using AutoMapper;
using ChatApp.Core.Application.Repositories;
using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.AppUsers;
using ChatApp.Core.Domain.Dtos.Preferences;
using ChatApp.Core.Domain.Entities;
using ChatApp.Core.Domain.Models;
using ChatApp.Extensions;
using ChatApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Infrastructure.Services
{
    public class AppUserService(ChatAppDbContext dbContext, IAppCacheService cacheService,
        IMapper mapper, IHttpContextAccessor httpContext)
        : GenericRepository<ChatAppDbContext, AppUser, string>(dbContext), IAppUserService
    {
        private static string GetUserCacheKey(string id) => $"User:{id}";
        private readonly string currentUserId = httpContext.GetUserId();

        public async Task<Result<bool>> CreateAppUserAsync(AppUserCreateDto user)
        {
            var mappedUser = mapper.Map<AppUser>(user);
            await AddAsync(mappedUser);

            return await SaveChangesAsync() > 0
                ? Result<bool>.Success(true)
                : Result<bool>.Fail("Error occured while creating user!", StatusCodes.Status500InternalServerError);

        }

        public async Task<Result<bool>> DeleteAppUserAsync(string id)
        {
            await cacheService.RemoveAsync(GetUserCacheKey(id));
            var user = await GetByIdAsync(id, true);
            user.IsValid = false;
            user.UpdatedDate = DateTime.Now;

            return await SaveChangesAsync() > 0
                ? Result<bool>.Success(true)
                : Result<bool>.Fail("Error occured while deleting user!", StatusCodes.Status500InternalServerError);
        }

        public async Task<Result<AppUserListDto>> GetAppUserByIdAsync(string id)
        {
            var cacheKey = GetUserCacheKey(id);
            var cachedData = await cacheService.GetAsync<AppUserListDto>(cacheKey);

            if (cachedData is null)
            {
                var user = await GetByIdAsync(id);
                if (user is null) return Result<AppUserListDto>.Fail("User not found!", StatusCodes.Status404NotFound);

                cachedData = mapper.Map<AppUserListDto>(user);
                await cacheService.SetAsync(cacheKey, cachedData, TimeSpan.FromMinutes(20));
            }

            return Result<AppUserListDto>.Success(cachedData);
        }

        public async Task<Result<bool>> UpdateAppUserAsync(AppUserUpdateDto userDto)
        {
            await cacheService.RemoveAsync(GetUserCacheKey(userDto.Id));
            var user = await GetByIdAsync(userDto.Id);
            mapper.Map(userDto, user);

            return await SaveChangesAsync() > 0
                ? Result<bool>.Success(true)
                : Result<bool>.Fail("Error occured while updating user!", StatusCodes.Status500InternalServerError);
        }


        public async Task<Result<bool>> UpdateAppUserPreferencesAsync(PreferenceUpdateDto preference)
        {
            if (preference.Id is null)
            {
                var userId = httpContextAccessor.GetUserId();
                var user = await GetByIdAsync(userId);
                user.Preference = mapper.Map<Preference>(preference);
            }
            else
            {
                var preferenceToUpdate = DbContext.Preferences.First(_ => _.Id == preference.Id);
                mapper.Map(preference, preferenceToUpdate);
            }

            return await SaveChangesAsync() > 0
                ? Result<bool>.Success(true)
                : Result<bool>.Fail("Error occured while updating user preferences!", StatusCodes.Status500InternalServerError);
        }

        public async Task<Result<PreferenceListDto>> GetAppUserPreferenceByIdAsync(string id)
        {
            var preference = await DbContext.Preferences.FirstOrDefaultAsync(_ => _.Id == id);
            if (preference is null) Result<PreferenceListDto>.Fail("Preference not found!", StatusCodes.Status404NotFound);

            return Result<PreferenceListDto>.Success(mapper.Map<PreferenceListDto>(preference));
        }
    }
}
