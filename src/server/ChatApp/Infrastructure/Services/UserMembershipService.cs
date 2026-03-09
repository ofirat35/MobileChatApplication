using ChatApp.Core.Application.Repositories;
using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Entities;
using ChatApp.Infrastructure.Data;

namespace ChatApp.Infrastructure.Services
{
    public class UserMembershipService(ChatAppDbContext context)
        : GenericRepository<ChatAppDbContext, UserMembership, Guid>(context), IUserMembershipService
    {
        public async Task<UserMembership> HasMembership(string membership, string userId)
        {
            return await GetSingleAsync(_ => _.UserId == userId && !_.MembershipEnded, includes: [m => m.Membership.Name == membership]);
        }
    }
}
