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
    public class MatchService(
        ChatAppDbContext context,
        IHttpContextAccessor httpContext,
        IAppUserService userService, IMapper mapper)
        : GenericRepository<ChatAppDbContext, Match, Guid>(context), IMatchService
    {
        private readonly string _currentUserId = httpContext.GetUserId();
        public async Task<PaginatedItemsViewModel<UserProfile>> GetMatches(int page, int pageSize = 10)
        {
            var matchesQuery =
                 from match in GetAll().OrderByDescending(_ => _.MatchedAt)
                 where match.IsValid &&
                    (match.FromUserId == _currentUserId ||
                       match.ToUserId == _currentUserId)
                 join appUser in userService.GetAll()
                    on match.FromUserId == _currentUserId ? match.ToUserId : match.FromUserId
                    equals appUser.Id
                 select appUser;

            var totalItems = await matchesQuery.LongCountAsync();

            if (page <= 0) page = 1;
            var matches = await matchesQuery.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
            var mappedMatches = mapper.Map<List<UserProfile>>(matches);

            return new PaginatedItemsViewModel<UserProfile>(page, pageSize, totalItems, mappedMatches);
        }
    }
}
