using ChatApp.Core.Application.Repositories;
using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Entities;
using ChatApp.Core.Domain.Models;
using ChatApp.Extensions;
using ChatApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Infrastructure.Services
{
    public class SwiperService(
        ChatAppDbContext dbContext,
        IAppUserService appUserService,
        IAppCacheService cacheService,
        IHttpContextAccessor httpContext)
        : GenericRepository<ChatAppDbContext, Swipe, Guid>(dbContext), ISwiperService
    {
        private const int CandidateWindowSize = 200;
        private const int RefillThreshold = 5;
        public async Task<Result<List<string>>> GetMatchingPreferences(int count)
        {
            var userId = httpContext.GetUserId();
            var cacheKey = GetMatchingUsersCacheKey(userId);

            bool poolChanged = false;

            var swipedUserIds = await DbContext.Swipes
                .Where(s => s.FromUserId == userId)
                .Select(s => s.ToUserId)
                .ToListAsync();

            var candidatePool = await cacheService.GetAsync<List<string>>(cacheKey);

            if (candidatePool == null || candidatePool.Count == 0)
            {
                candidatePool = await BuildCandidatePool(userId, CandidateWindowSize);
                poolChanged = true;
            }


            var availableCandidates = candidatePool.Except(swipedUserIds).ToList();

            if (availableCandidates.Count < RefillThreshold)
            {
                var newCandidates = await BuildCandidatePool(
                    userId,
                    CandidateWindowSize - availableCandidates.Count,
                    availableCandidates
                );

                availableCandidates.AddRange(newCandidates);
                candidatePool = availableCandidates;
                poolChanged = true;
            }

            if (poolChanged)
            {
                await cacheService.SetAsync(
                    cacheKey,
                    candidatePool,
                    TimeSpan.FromMinutes(20)
                );
            }

            return Result<List<string>>.Success(availableCandidates.Take(count).ToList());
        }

        public async Task<Result<bool>> Like(string id)
        {
            var userId = httpContext.GetUserId();
            var swipe = await DbContext.Swipes.FirstOrDefaultAsync(s => s.FromUserId == userId && s.ToUserId == id);
            if (swipe != null)
            {
                if (swipe.IsLike)
                    return Result<bool>.Fail("Already liked", StatusCodes.Status409Conflict);
                if (!swipe.IsLike)
                    return Result<bool>.Fail("Already passed", StatusCodes.Status409Conflict);
            }

            await AddAsync(new Swipe
            {
                FromUserId = userId,
                ToUserId = id,
                IsLike = true,
            });
            return await SaveChangesAsync() > 0
                ? Result<bool>.Success(true)
                : Result<bool>.Fail("Error occured while liking!", StatusCodes.Status500InternalServerError);
        }

        public async Task<Result<bool>> Pass(string id)
        {
            var userId = httpContext.GetUserId();
            var swipe = await DbContext.Swipes.FirstOrDefaultAsync(s => s.FromUserId == userId && s.ToUserId == id);
            if (swipe != null)
            {
                if (swipe.IsLike)
                    return Result<bool>.Fail("Already liked", StatusCodes.Status409Conflict);
                if (!swipe.IsLike)
                    return Result<bool>.Fail("Already passed", StatusCodes.Status409Conflict);
            }

            await AddAsync(new Swipe
            {
                FromUserId = httpContext.GetUserId(),
                ToUserId = id,
                IsLike = false,
            });
            return await SaveChangesAsync() > 0
                ? Result<bool>.Success(true)
                : Result<bool>.Fail("Error occured while liking!", StatusCodes.Status500InternalServerError);
        }

        private async Task<List<string>> BuildCandidatePool(string userId, int length, List<string> excludedCandidates = null)
        {
            var preference = await appUserService.GetAppUserPreferenceByIdAsync(userId);
            if (!preference.IsSuccess)
                throw new Exception(preference.Error);

            var query = DbContext.AppUsers.AsQueryable().Where(u => u.Id != userId);
            if (excludedCandidates != null && excludedCandidates.Count > 0)
                query = query.Where(u => !excludedCandidates.Contains(u.Id));

            if (preference.Value != null)
            {
                if (preference.Value.MinAge != null)
                {
                    var maxBirthDate = DateOnly.FromDateTime(DateTime.UtcNow.AddYears(-preference.Value.MinAge.Value));
                    query = query.Where(u => u.BirthDate <=  maxBirthDate);
                }

                if (preference.Value.MaxAge != null)
                {
                    var minBirthDate = DateOnly.FromDateTime(DateTime.UtcNow.AddYears(-preference.Value.MaxAge.Value));
                    query = query.Where(u => u.BirthDate >= minBirthDate);
                }

                if (preference.Value.Gender != null)
                {
                    query = query.Where(u => u.Gender == preference.Value.Gender);
                }
            }

            return await query
                .Select(u => u.Id)
                .Take(length)
                .ToListAsync();
        }

        private static string GetMatchingUsersCacheKey(string id) => $"MathingUsers:{id}";
    }
}
