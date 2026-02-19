using AutoMapper;
using ChatApp.Core.Application.Enums;
using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.AppUsers;
using ChatApp.Core.Domain.Models;
using ChatApp.Extensions;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Infrastructure.Services
{
    public class UserProfileService(
        ISwiperService swiperService,
        IAppUserService appUserService,
        IHttpContextAccessor httpContext,
        IMapper mapper)
        : IUserProfileService
    {

        private readonly string _currentUserId = httpContext.GetUserId();
        public async Task<PaginatedItemsViewModel<InterestedUserProfile>> GetInterestedUserProfiles(int page, int pageSize)
        {
            var swipesQuery = swiperService
                .GetAll()
                .Where(_ => _.ToUserId == _currentUserId && _.IsValid &&
                    (_.Status == SwipeStatus.Like || _.Status == SwipeStatus.ProfileVisited))
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
            var status = await swiperService
                .GetSingleAsync(_ => _.IsValid && (_.FromUserId == userId && _.ToUserId == _currentUserId), false);
            var userProfile = new InterestedUserProfile
            {
                User = mapper.Map<UserProfile>(response),
                Status = status?.Status
            };

            return userProfile != null
                ? Result<InterestedUserProfile>.Success(userProfile)
                : Result<InterestedUserProfile>.Fail("User not found!", StatusCodes.Status404NotFound);
        }
    }
}
