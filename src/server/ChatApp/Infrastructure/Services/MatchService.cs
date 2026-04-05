using AutoMapper;
using ChatApp.Core.Application.Consts;
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
        IMapper mapper,
        ILogger<MatchService> logger)
        : BaseService<ChatAppDbContext, Match, Guid>(context, logger, httpContext, EventIds.MatchService),
            IMatchService
    {
        private readonly string _currentUserId = httpContext.GetUserId();
        public async Task<PaginatedItemsViewModel<AppUserListDto>> GetMatches(int page, int pageSize = 10)
        {
            var matchesQuery =
                 from match in GetAll().OrderByDescending(_ => _.CreatedDate)
                 where match.IsValid &&
                    (match.FromUserId == _currentUserId ||
                       match.ToUserId == _currentUserId)
                 join appUser in DbContext.AppUsers
                    on match.FromUserId == _currentUserId ? match.ToUserId : match.FromUserId
                    equals appUser.Id
                 select appUser;

            var totalItems = await matchesQuery.LongCountAsync();

            if (page <= 0) page = 1;
            var matches = await matchesQuery.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
            var mappedMatches = mapper.Map<List<AppUserListDto>>(matches);

            return new PaginatedItemsViewModel<AppUserListDto>(page, pageSize, totalItems, mappedMatches);
        }

        public async Task<Result<bool>> RemoveMatchAsync(string userId)
        {
            var match = await GetSingleAsync(_ =>
                ((_.FromUserId == userId && _.ToUserId == _currentUserId) ||
                (_.FromUserId == _currentUserId && _.ToUserId == userId)) && _.IsValid);
            if (match is null) return Result<bool>.Fail(ExceptionMessages.EntityNotFound, StatusCodes.Status404NotFound);

            await DeleteByIdAsync(match.Id);
            var result = await SaveChangesAsync(match, DbOperation.Delete);

            return result
                ? Result<bool>.Success(true)
                : Result<bool>.Fail(ExceptionMessages.DbOperationFailed, StatusCodes.Status500InternalServerError);
        }
    }
}
