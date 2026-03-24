using ChatApp.Core.Application.Repositories;
using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Entities;
using ChatApp.Infrastructure.Data;

namespace ChatApp.Infrastructure.Services
{
    public class MembershipService(
        ChatAppDbContext context, 
        IAppCacheService cacheService,
        ILogger<MembershipService> logger,
        IHttpContextAccessor httpContext)
        : BaseService<ChatAppDbContext, Membership, Guid>(context, logger, httpContext), IMembershipService
    {
        private const string activeMembershipsCacheKey = "active-memberships";
        public async Task<List<Membership>> GetActiveMembershipTypes()
        {
            var memberships = await cacheService.GetAsync<List<Membership>>(activeMembershipsCacheKey);
            if (memberships is not null) return memberships;

            memberships = await Get(_ => _.IsValid, false);
            await cacheService.SetAsync(activeMembershipsCacheKey, memberships, TimeSpan.FromHours(12));

            return memberships;
        }

        public async Task DeleteMembershipAsync(Guid id)
        {
            await DeleteByIdAsync(id);
            await cacheService.RemoveAsync(activeMembershipsCacheKey);
        }
    }
}
