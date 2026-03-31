using AutoMapper;
using ChatApp.Core.Application.Consts;
using ChatApp.Core.Application.Enums;
using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.AppUsers;
using ChatApp.Core.Domain.Entities;
using ChatApp.Core.Domain.Models;
using ChatApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Infrastructure.Services
{
    public class SwiperService(
        ChatAppDbContext dbContext,
        IAppUserService userService,
        IAppCacheService cacheService,
        IMatchService matchService,
        IMapper mapper,
        IHttpContextAccessor httpContext,
        ILogger<SwiperService> logger)
        : BaseService<ChatAppDbContext, Swipe, Guid>(dbContext, logger, httpContext, EventIds.SwiperService),
            ISwiperService
    {
        private const int CandidateWindowSize = 200;
        private const int RefillThreshold = 5;
        public async Task<Result<List<UserProfile>>> GetMatchingPreferences(int count, List<string>? excludedUserIds)
        {
            var cacheKey = GetMatchingUsersCacheKey(CurrentUserId);

            bool poolChanged = false;

            var matchesQuery = matchService.GetAll().Where(m => m.IsValid);
            var swipedUserIds = await GetAll()
                .Where(s => s.FromUserId == CurrentUserId && s.IsValid &&
                    (s.Status == SwipeStatus.Like || s.Status == SwipeStatus.Pass || s.Status == SwipeStatus.ProfileVisited) &&
                     !matchesQuery.Any(m =>
                    (m.FromUserId == CurrentUserId && m.ToUserId == s.ToUserId) ||
                     (m.FromUserId == s.FromUserId && m.ToUserId == CurrentUserId)))
                .Select(s => s.ToUserId)
                .ToListAsync();
            var totalExcluded = swipedUserIds;
            if (excludedUserIds != null && excludedUserIds.Any())
            {
                totalExcluded = swipedUserIds.Concat(excludedUserIds).Distinct().ToList();
            }

            var candidatePool = await cacheService.GetAsync<List<UserProfile>>(cacheKey);

            if (candidatePool == null || candidatePool.Count == 0)
            {
                candidatePool = await BuildCandidatePool(CurrentUserId, CandidateWindowSize, totalExcluded);
                poolChanged = true;
            }

            var availableCandidates = candidatePool!.Where(c => !totalExcluded.Contains(c.Id)).ToList();

            if (availableCandidates.Count < RefillThreshold)
            {
                var excluded = totalExcluded.Concat(availableCandidates.Select(c => c.Id)).ToList();

                var newCandidates = await BuildCandidatePool(
                    CurrentUserId,
                    CandidateWindowSize,
                    excluded);

                availableCandidates.AddRange(newCandidates);
                candidatePool = availableCandidates;

                poolChanged = true;
            }

            if (poolChanged)
            {
                await cacheService.SetAsync(
                    cacheKey,
                    candidatePool,
                    TimeSpan.FromMinutes(20));
            }


            return SuccessResult(availableCandidates.Take(count).ToList());
        }

        public async Task ClearMatchingPreferencesCache()
        {
            var cacheKey = GetMatchingUsersCacheKey(CurrentUserId);
            await cacheService.RemoveAsync(cacheKey);
        }

        public async Task<Result<bool>> Like(string id)
        {
            var swipe = await GetSingleAsync(s => s.FromUserId == CurrentUserId && s.ToUserId == id
                                && s.Status == SwipeStatus.Like && s.IsValid);
            if (swipe != null)
                return FailResult<bool>(ExceptionMessages.ConflictException, StatusCodes.Status409Conflict);

            var otherSwipe = await GetSingleAsync(s => s.FromUserId == id && s.ToUserId == CurrentUserId
                                && s.Status == SwipeStatus.Like && s.IsValid);

            if (otherSwipe != null)
            {
                await matchService.AddAsync(new Match
                {
                    FromUserId = id,
                    ToUserId = CurrentUserId,
                    IsValid = true
                });
            }

            swipe = new Swipe
            {
                FromUserId = CurrentUserId,
                ToUserId = id,
                Status = SwipeStatus.Like,
                IsValid = true
            };
            await AddAsync(swipe);

            return await SaveChangesAsync(swipe, DbOperation.Create)
                ? SuccessResult(true)
                : FailResult<bool>(ExceptionMessages.DbOperationFailed, StatusCodes.Status500InternalServerError);
        }

        public async Task<Result<bool>> Pass(string id)
        {
            var swipe = await GetSingleAsync(s => s.FromUserId == CurrentUserId && s.ToUserId == id
                                && (s.Status == SwipeStatus.Like || s.Status == SwipeStatus.Pass) && s.IsValid);
            if (swipe != null)
                return FailResult<bool>(ExceptionMessages.ConflictException, StatusCodes.Status409Conflict);

            swipe = new Swipe
            {
                FromUserId = CurrentUserId,
                ToUserId = id,
                Status = SwipeStatus.Pass,
                IsValid = true
            };
            await AddAsync(swipe);

            return await SaveChangesAsync(swipe, DbOperation.Create)
                ? SuccessResult(true)
                : FailResult<bool>(ExceptionMessages.DbOperationFailed, StatusCodes.Status500InternalServerError);
        }

        public async Task<Result<bool>> ViewProfile(string id)
        {
            var swipe = await GetSingleAsync(s => s.FromUserId == CurrentUserId && s.ToUserId == id
                                && (s.Status == SwipeStatus.ProfileVisited) && s.IsValid);
            if (swipe != null) return SuccessResult(true);

            swipe = new Swipe
            {
                FromUserId = CurrentUserId,
                ToUserId = id,
                Status = SwipeStatus.ProfileVisited,
            };
            await AddAsync(swipe);

            return await SaveChangesAsync(swipe, DbOperation.Create)
               ? SuccessResult(true)
               : FailResult<bool>(ExceptionMessages.DbOperationFailed, StatusCodes.Status500InternalServerError);
        }

        private async Task<List<UserProfile>> BuildCandidatePool(string userId, int length, List<string> excludedCandidates = null)
        {
            var preference = await userService.GetAppUserPreferenceByIdAsync(userId);
            if (!preference.IsSuccess)
                throw new Exception(preference.Error);

            var query = userService.GetAll().Where(u => u.Id != userId);
            if (excludedCandidates != null && excludedCandidates.Count > 0)
                query = query.Where(u => !excludedCandidates.Contains(u.Id));

            if (preference.Value != null)
            {
                if (preference.Value.MinAge != null)
                {
                    var maxBirthDate = DateOnly.FromDateTime(DateTime.UtcNow.AddYears(-preference.Value.MinAge.Value));
                    query = query.Where(u => u.BirthDate <= maxBirthDate);
                }

                if (preference.Value.MaxAge != null)
                {
                    var minBirthDate = DateOnly.FromDateTime(DateTime.UtcNow.AddYears(-preference.Value.MaxAge.Value));
                    query = query.Where(u => u.BirthDate >= minBirthDate);
                }

                if (preference.Value.Gender != null && preference.Value.Gender != GenderEnum.Both)
                {
                    query = query.Where(u => u.Gender == preference.Value.Gender);
                }

                if (!string.IsNullOrEmpty(preference.Value.Country))
                {
                    query = query.Where(u => u.Country == preference.Value.Country);
                }
            }

            var result = await query
                .OrderBy(u => u.CreatedDate)
                .Take(length)
                .ToListAsync();

            return mapper.Map<List<UserProfile>>(result);
        }

        private static string GetMatchingUsersCacheKey(string id) => $"MathingUsers:{id}";
    }
}
