using AutoMapper;
using ChatApp.Core.Application.Consts;
using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.AppUsers;
using ChatApp.Core.Domain.Dtos.Preferences;
using ChatApp.Core.Domain.Entities;
using ChatApp.Core.Domain.Models;
using ChatApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Infrastructure.Services
{
    public class AppUserService(
        ChatAppDbContext dbContext,
        IAppCacheService cacheService,
        IMapper mapper,
        IHttpContextAccessor httpContext,
        ILogger<AppUserService> logger)
        : BaseService<ChatAppDbContext, AppUser, string>(dbContext, logger, httpContext, EventIds.AppUserService),
            IAppUserService
    {
        private static string GetUserCacheKey(string id) => $"User:{id}";

        public async Task<Result<bool>> CreateAppUserAsync(AppUserCreateDto user)
        {
            var mappedUser = mapper.Map<AppUser>(user);
            mappedUser.Preference = new() ;
            await AddAsync(mappedUser);
            var response = await SaveChangesAsync(user, DbOperation.Create);

            return response
                ? SuccessResult(true)
                : FailResult<bool>(ExceptionMessages.DbOperationFailed, StatusCodes.Status500InternalServerError);
        }


        public async Task CreatePrefenceForAll()
        {
            var all = GetAll(true);
            foreach (var item in all)
            {
                item.Preference = new();
            }
            await SaveChangesAsync();
        }

        public async Task<Result<bool>> DeleteAppUserAsync(string id)
        {
            var user = await GetByIdAsync(id, true);

            if (user is null)
            {
                LogEntityNotFound<AppUser>(id);
                return FailResult<bool>(ExceptionMessages.EntityNotFound, StatusCodes.Status404NotFound);
            }

            await cacheService.RemoveAsync(GetUserCacheKey(id));
            await DeleteByIdAsync(id);
            var response = await SaveChangesAsync(user, DbOperation.Delete);

            return response
               ? SuccessResult(true)
               : FailResult<bool>(ExceptionMessages.DbOperationFailed, StatusCodes.Status500InternalServerError);
        }

        public async Task<Result<AppUserListDto>> GetAppUserByIdAsync(string id)
        {
            var cacheKey = GetUserCacheKey(id);
            var cachedData = await cacheService.GetAsync<AppUserListDto>(cacheKey);

            if (cachedData is null)
            {
                var user = await GetByIdAsync(id);

                if (user is null)
                {
                    LogEntityNotFound<AppUser>(id);
                    return FailResult<AppUserListDto>(ExceptionMessages.EntityNotFound, StatusCodes.Status404NotFound);
                }

                cachedData = mapper.Map<AppUserListDto>(user);
                await cacheService.SetAsync(cacheKey, cachedData, TimeSpan.FromMinutes(30));
            }

            return SuccessResult(cachedData);
        }

        public async Task<Result<bool>> UpdateAppUserAsync(AppUserUpdateDto userDto)
        {
            await cacheService.RemoveAsync(GetUserCacheKey(userDto.Id));
            var user = await GetByIdAsync(userDto.Id);
            if (user is null)
            {
                LogEntityNotFound<AppUser>(userDto.Id);
                return FailResult<bool>(ExceptionMessages.EntityNotFound, StatusCodes.Status404NotFound);
            }

            mapper.Map(userDto, user);

            var response = await SaveChangesAsync(user, DbOperation.Update);

            return response
                ? SuccessResult(true)
                : FailResult<bool>(ExceptionMessages.DbOperationFailed, StatusCodes.Status500InternalServerError);
        }


        public async Task<Result<bool>> UpdateAppUserPreferencesAsync(PreferenceUpdateDto preference)
        {
            Preference? preferenceToUpdate;
            if (preference.Id is null)
            {
                var user = await GetByIdAsync(CurrentUserId);
                preferenceToUpdate = mapper.Map<Preference>(preference);
                user.Preference = preferenceToUpdate;
            }
            else
            {
                preferenceToUpdate = await DbContext.Preferences.FirstAsync(_ => _.Id == preference.Id);
                mapper.Map(preference, preferenceToUpdate);
            }
            var response = await SaveChangesAsync(preferenceToUpdate, DbOperation.Update);

            return response
                ? SuccessResult(response)
                : FailResult<bool>(ExceptionMessages.DbOperationFailed, StatusCodes.Status500InternalServerError);
        }

        public async Task<Result<PreferenceListDto>> GetAppUserPreferenceByIdAsync(string id)
        {
            var preference = await DbContext.Preferences.FirstOrDefaultAsync(_ => _.Id == id);
            if (preference is null)
            {
                LogEntityNotFound<Preference>(id);
                return FailResult<PreferenceListDto>(ExceptionMessages.EntityNotFound, StatusCodes.Status404NotFound);
            }

            return SuccessResult(mapper.Map<PreferenceListDto>(preference));
        }

        public async Task<bool> UpdateLastSeenAsync(string id, DateTime lastSeen)
        {
            var user = await GetByIdAsync(id);
            if (user is null)
            {
                LogEntityNotFound<AppUser>(id);
                return false;
            }
            user.LastSeen = lastSeen;
            var response = await SaveChangesAsync(user, DbOperation.Update);
           
            return response;
        }
    }
}
