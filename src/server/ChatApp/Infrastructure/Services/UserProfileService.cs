using AutoMapper;
using ChatApp.Core.Application.Consts;
using ChatApp.Core.Application.Enums;
using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.AppUsers;
using ChatApp.Core.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Infrastructure.Services
{
    public class UserProfileService(
        ISwiperService swiperService,
        IAppUserService appUserService,
        IMatchService matchService,
        IHttpContextAccessor httpContext,
        IMapper mapper,
        ILogger<UserProfileService> logger)
        : BaseService(logger, httpContext, EventIds.UserProfileService), IUserProfileService
    {
        public async Task<PaginatedItemsViewModel<InterestedUserProfile>> GetInterestedUserProfiles(int page, int pageSize)
        {
            var matchesQuery = matchService.GetAll().Where(m => m.IsValid);
            var swipesQuery = swiperService
                .GetAll()
                .Where(s => s.ToUserId == CurrentUserId && s.IsValid &&
                    (s.Status == SwipeStatus.Like || s.Status == SwipeStatus.ProfileVisited) &&
                    !matchesQuery.Any(m =>
                        (m.FromUserId == CurrentUserId && m.ToUserId == s.ToUserId) ||
                         (m.FromUserId == s.FromUserId && m.ToUserId == CurrentUserId)))
                .GroupBy(_ => _.FromUserId)
                .Select(g => new
                {
                    FromUserId = g.Key,
                    Status = g.Any(x => x.Status == SwipeStatus.Like)
                        ? SwipeStatus.Like
                        : SwipeStatus.ProfileVisited
                });

            var totalItems = await swipesQuery.LongCountAsync();

            if (page <= 0) page = 1;
            var swipes = await swipesQuery.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
            var swipeIds = swipes.Select(_ => _.FromUserId).ToList();
            var users = await appUserService.Get(_ => swipeIds.Contains(_.Id), false);


            var mappedUsers = new List<InterestedUserProfile>();
            users.ForEach(user =>
            {
                mappedUsers.Add(new()
                {
                    User = mapper.Map<UserProfile>(user),
                    Status = swipes.First(_ => _.FromUserId == user.Id).Status
                });
            });


            return new PaginatedItemsViewModel<InterestedUserProfile>(page, pageSize, totalItems, mappedUsers);
        }

        public async Task<Result<InterestedUserProfile>> GetUserProfile(string userId)
        {
            var response = await appUserService.GetByIdAsync(userId);
            if (response is null)
            {
                LogEntityNotFound<InterestedUserProfile>(userId);
                return FailResult<InterestedUserProfile>(ExceptionMessages.EntityNotFound, StatusCodes.Status404NotFound);
            }

            var status = await swiperService
                .GetSingleAsync(_ => _.IsValid && (_.FromUserId == userId && _.ToUserId == CurrentUserId), false);
            var userProfile = new InterestedUserProfile
            {
                User = mapper.Map<UserProfile>(response),
                Status = status?.Status
            };

            return SuccessResult(userProfile);
        }
    }
}
