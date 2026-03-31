using ChatApp.Core.Application.Consts;
using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Entities;
using ChatApp.Core.Domain.Models;
using ChatApp.Infrastructure.Data;

namespace ChatApp.Infrastructure.Services
{
    public class UserMembershipService(
        ChatAppDbContext context,
        ILogger<UserMembershipService> logger,
        IHttpContextAccessor httpContext)
        : BaseService<ChatAppDbContext, UserMembership, Guid>(context, logger, httpContext, EventIds.UserMembershipService),
            IUserMembershipService
    {
        public async Task<Result<UserMembership>> HasMembershipAsync(Guid membershipId, string userId)
        {
            var membership = await GetSingleAsync(_ => _.UserId == userId && !_.MembershipEnded,
                includes: [m => m.Membership.Id == membershipId]);
            if (membership is null)
            {
                LogEntityNotFound<UserMembership>(membershipId.ToString());
                return FailResult<UserMembership>(ExceptionMessages.EntityNotFound, StatusCodes.Status404NotFound);
            }

            return SuccessResult(membership, StatusCodes.Status404NotFound);
        }
    }
}
