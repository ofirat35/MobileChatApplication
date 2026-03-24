using AutoMapper;
using ChatApp.Core.Application.Consts;
using ChatApp.Core.Application.Extensions;
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
        : BaseService<ChatAppDbContext, AppUser, string>(dbContext, logger, httpContext), IAppUserService
    {
        private static string GetUserCacheKey(string id) => $"User:{id}";

        public async Task<Result<bool>> CreateAppUserAsync(AppUserCreateDto user)
        {
            var mappedUser = mapper.Map<AppUser>(user);
            await AddAsync(mappedUser);

            var response = await SaveChangesAsync(user, DbOperation.Create);

            return response
                ? SuccessResult(true)
                : FailResult<bool>(LoggerMessages.DbOperationFailed, StatusCodes.Status500InternalServerError);
        }

        public async Task<Result<bool>> DeleteAppUserAsync(string id)
        {
            await cacheService.RemoveAsync(GetUserCacheKey(id));
            var user = await GetByIdAsync(id, true);

            if (!EntityExists(user, id))
                return FailResult<bool>(LoggerMessages.EntityNotFound, StatusCodes.Status404NotFound);

            await DeleteByIdAsync(id);
            var response = await SaveChangesAsync(user, DbOperation.Delete);

            return response
               ? SuccessResult(true)
               : FailResult<bool>(LoggerMessages.DbOperationFailed, StatusCodes.Status500InternalServerError);
        }

        public async Task<Result<AppUserListDto>> GetAppUserByIdAsync(string id)
        {
            var cacheKey = GetUserCacheKey(id);
            var cachedData = await cacheService.GetAsync<AppUserListDto>(cacheKey);

            if (cachedData is null)
            {
                var user = await GetByIdAsync(id);

                if (!EntityExists(user, id))
                    return FailResult<AppUserListDto>(LoggerMessages.EntityNotFound, StatusCodes.Status404NotFound);

                cachedData = mapper.Map<AppUserListDto>(user);
                await cacheService.SetAsync(cacheKey, cachedData, TimeSpan.FromMinutes(20));
            }

            return SuccessResult(cachedData);
        }

        public async Task<Result<bool>> UpdateAppUserAsync(AppUserUpdateDto userDto)
        {
            await cacheService.RemoveAsync(GetUserCacheKey(userDto.Id));
            var user = await GetByIdAsync(userDto.Id);
            if (!EntityExists(user, userDto.Id))
                return FailResult<bool>(LoggerMessages.EntityNotFound, StatusCodes.Status404NotFound);

            mapper.Map(userDto, user);

            var response = await SaveChangesAsync(user, DbOperation.Update);

            return response
                ? SuccessResult(true)
                : FailResult<bool>(LoggerMessages.DbOperationFailed, StatusCodes.Status500InternalServerError);
        }


        public async Task<Result<bool>> UpdateAppUserPreferencesAsync(PreferenceUpdateDto preference)
        {
            Preference? preferenceToUpdate;
            if (preference.Id is null)
            {
                var user = await GetByIdAsync(_currentUserId);
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
                : FailResult<bool>(LoggerMessages.DbOperationFailed, StatusCodes.Status500InternalServerError);
        }

        public async Task<Result<PreferenceListDto>> GetAppUserPreferenceByIdAsync(string id)
        {
            var preference = await DbContext.Preferences.FirstOrDefaultAsync(_ => _.Id == id);
            if (!EntityExists(preference, id))
                return FailResult<PreferenceListDto>(LoggerMessages.EntityNotFound, StatusCodes.Status404NotFound);

            return SuccessResult(mapper.Map<PreferenceListDto>(preference));
        }
    }
}
