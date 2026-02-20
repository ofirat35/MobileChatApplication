using AutoMapper;
using ChatApp.Core.Application.Enums;
using ChatApp.Core.Application.Repositories;
using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.AppUsers;
using ChatApp.Core.Domain.Entities;
using ChatApp.Core.Domain.Models;
using ChatApp.Extensions;
using ChatApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Infrastructure.Services
{
    public class SwiperService(
        ChatAppDbContext dbContext,
        IAppUserService userService,
        IAppCacheService cacheService,
        IMapper mapper,
        IHttpContextAccessor httpContext)
        : GenericRepository<ChatAppDbContext, Swipe, Guid>(dbContext), ISwiperService
    {
        private const int CandidateWindowSize = 200;
        private const int RefillThreshold = 5;
        private readonly string _currentUserId = httpContext.GetUserId();

        public async Task<Result<List<UserProfile>>> GetMatchingPreferences(int count, int? offset)
        {
            var cacheKey = GetMatchingUsersCacheKey(_currentUserId);

            bool poolChanged = false;

            var swipedUserIds = await GetAll()
                .Where(s => s.FromUserId == _currentUserId && s.IsValid &&
                    (s.Status == SwipeStatus.Like || s.Status == SwipeStatus.Pass || s.Status == SwipeStatus.ProfileVisited))
                .Select(s => s.ToUserId)
                .ToListAsync();

            var candidatePool = await cacheService.GetAsync<List<UserProfile>>(cacheKey);

            if (candidatePool == null || candidatePool.Count == 0)
            {
                candidatePool = await BuildCandidatePool(_currentUserId, CandidateWindowSize, swipedUserIds);
                poolChanged = true;
            }

            var availableCandidates = candidatePool!.Where(c => !swipedUserIds.Contains(c.Id)).ToList();

            if (availableCandidates.Count < RefillThreshold)
            {
                var excluded = swipedUserIds.Concat(availableCandidates.Select(c => c.Id)).ToList();

                var newCandidates = await BuildCandidatePool(
                    _currentUserId,
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

            if (offset.HasValue) availableCandidates = availableCandidates.Skip(offset.Value).ToList();

            return Result<List<UserProfile>>.Success(availableCandidates.Take(count).ToList());
        }

        public async Task<Result<bool>> Like(string id)
        {
            var swipe = await GetSingleAsync(s => s.FromUserId == _currentUserId && s.ToUserId == id
                                && s.Status == SwipeStatus.Like && s.IsValid);
            if (swipe != null)
            {
                return swipe.Status == SwipeStatus.Like
                    ? Result<bool>.Fail("Already liked", StatusCodes.Status409Conflict)
                    : Result<bool>.Fail("Already passed", StatusCodes.Status409Conflict);
            }

            await AddAsync(new Swipe
            {
                FromUserId = _currentUserId,
                ToUserId = id,
                Status = SwipeStatus.Like,
                IsValid = true
            });
            return await SaveChangesAsync() > 0
                ? Result<bool>.Success(true)
                : Result<bool>.Fail("Error occured while liking!", StatusCodes.Status500InternalServerError);
        }

        public async Task<Result<bool>> Pass(string id)
        {
            var swipe = await GetSingleAsync(s => s.FromUserId == _currentUserId && s.ToUserId == id
                                && (s.Status == SwipeStatus.Like || s.Status == SwipeStatus.Pass) && s.IsValid);
            if (swipe != null)
            {
                return swipe.Status == SwipeStatus.Like
                      ? Result<bool>.Fail("Already liked", StatusCodes.Status409Conflict)
                      : Result<bool>.Fail("Already passed", StatusCodes.Status409Conflict);
            }

            await AddAsync(new Swipe
            {
                FromUserId = _currentUserId,
                ToUserId = id,
                Status = SwipeStatus.Pass,
                IsValid = true
            });
            return await SaveChangesAsync() > 0
                ? Result<bool>.Success(true)
                : Result<bool>.Fail("Error occured while liking!", StatusCodes.Status500InternalServerError);
        }

        public async Task<Result<bool>> ViewProfile(string id)
        {
            var swipe = await GetSingleAsync(s => s.FromUserId == _currentUserId && s.ToUserId == id
                                && (s.Status == SwipeStatus.ProfileVisited) && s.IsValid);
            if (swipe != null) return Result<bool>.Success(true);

            await AddAsync(new Swipe
            {
                FromUserId = _currentUserId,
                ToUserId = id,
                Status = SwipeStatus.ProfileVisited,
            });

            await SaveChangesAsync();
            return Result<bool>.Success(true);
        }

        public async Task<PaginatedItemsViewModel<UserProfile>> GetMatches(int page, int pageSize = 10)
        {
            var matchesQuery =
                 from myLike in GetAll()
                 where myLike.FromUserId == _currentUserId
                       && myLike.Status == SwipeStatus.Like
                 join theirLike in GetAll()
                     on new { A = myLike.ToUserId, B = _currentUserId }
                     equals new { A = theirLike.FromUserId, B = theirLike.ToUserId }
                 where theirLike.Status == SwipeStatus.Like
                 join appUser in userService.GetAll()
                    on myLike.ToUserId equals appUser.Id
                 select appUser;

            var totalItems = await matchesQuery.LongCountAsync();

            if (page <= 0) page = 1;
            var matches = await matchesQuery.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
            var mappedMatches = mapper.Map<List<UserProfile>>(matches);

            return new PaginatedItemsViewModel<UserProfile>(page, pageSize, totalItems, mappedMatches);
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

                if (preference.Value.Gender != null)
                {
                    query = query.Where(u => u.Gender == preference.Value.Gender);
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
