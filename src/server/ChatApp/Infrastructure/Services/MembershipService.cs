using ChatApp.Core.Application.Consts;
using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Entities;
using ChatApp.Core.Domain.Models;
using ChatApp.Infrastructure.Data;

namespace ChatApp.Infrastructure.Services
{
    public class MembershipService(
        ChatAppDbContext context,
        IAppCacheService cacheService,
        ILogger<MembershipService> logger,
        IHttpContextAccessor httpContext,
        IUserMembershipService userMembershipService,
        IKeycloakService keycloakService,
        IPaymentService paymentService)
        : BaseService<ChatAppDbContext, Membership, Guid>(context, logger, httpContext, EventIds.MembershipService),
            IMembershipService
    {
        private const string activeMembershipsCacheKey = "active-memberships";

        public async Task<Result<List<Membership>>> GetActiveMembershipsAsync()
        {
            var memberships = await cacheService.GetAsync<List<Membership>>(activeMembershipsCacheKey);
            if (memberships is not null) return SuccessResult(memberships);

            memberships = await Get(_ => _.IsValid, false);
            await cacheService.SetAsync(activeMembershipsCacheKey, memberships, TimeSpan.FromHours(24));

            return SuccessResult(memberships);
        }

        public async Task<Result<Membership>> GetMembershipByNameAsync(string membershipName)
        {
            var membership = await GetSingleAsync(_ => _.Name == membershipName && _.IsValid);
            if (membership is null)
            {
                LogEntityNotFound<Membership>(membershipName);
                return FailResult<Membership>(ExceptionMessages.EntityNotFound, StatusCodes.Status404NotFound);
            }

            return SuccessResult(membership);
        }

        public async Task<Result<Membership>> GetMembershipByIdAsync(Guid id)
        {

            var membership = await GetSingleAsync(_ => _.Id == id && _.IsValid);
            if (membership is null)
            {
                LogEntityNotFound<Membership>(id.ToString());
                return FailResult<Membership>(ExceptionMessages.EntityNotFound, StatusCodes.Status404NotFound);
            }

            return SuccessResult(membership);
        }

        public async Task<Result<bool>> CreateMembershipAsync(Membership membership)
        {
            var membershipExists = await GetSingleAsync(_ => _.Name == membership.Name && _.IsValid);
            if (membershipExists != null)
            {
                LogEntityNotFound<Membership>(membership.Id.ToString());
                return FailResult<bool>(ExceptionMessages.ConflictException, StatusCodes.Status409Conflict);
            }

            await cacheService.RemoveAsync(activeMembershipsCacheKey);
            await AddAsync(membership);
            var result = await SaveChangesAsync(membership, DbOperation.Create);

            if (!result)
            {
                LogDbOperationFailed(membership, DbOperation.Create);
                return FailResult<bool>(ExceptionMessages.DbOperationFailed, StatusCodes.Status500InternalServerError);
            }

            return SuccessResult(true);
        }

        public async Task<Result<bool>> DeleteMembershipAsync(Guid id)
        {
            await cacheService.RemoveAsync(activeMembershipsCacheKey);
            await DeleteByIdAsync(id);
            var result = await SaveChangesAsync<Membership>(null, DbOperation.Delete);

            if (!result)
            {
                LogDbOperationFailed<Membership>(null, DbOperation.Delete);
                return FailResult<bool>(ExceptionMessages.DbOperationFailed, StatusCodes.Status500InternalServerError);
            }

            return SuccessResult(true);
        }

        public async Task<Result<bool>> BuyMembershipAsync(Guid membershipId, string userId, byte duration)
        {
            var paymentStatus = await paymentService.ProcessPaymentAsync();
            if (!paymentStatus.IsSuccess)
                return FailResult<bool>(paymentStatus.Error, paymentStatus.StatusCode);

            var membership = await GetMembershipByIdAsync(membershipId);
            if (!membership.IsSuccess)
                return FailResult<bool>(membership.Error, (int)membership.StatusCode);

            var userMembership = await userMembershipService.HasMembershipAsync(membershipId, userId);
            if (!userMembership.IsSuccess)
                return FailResult<bool>(userMembership.Error, (int)userMembership.StatusCode);


            var entity = new UserMembership
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                MembershipId = membership.Value!.Id,
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddMonths(duration),
                TotalAmount = membership.Value.Price * duration,
                MembershipEnded = false
            };

            try
            {
                var keyCloakResponse = await keycloakService.AssignClientRoleAsync(userId, membership.Value.Name);
                if (!keyCloakResponse.IsSuccess)
                    return FailResult<bool>(keyCloakResponse.Error, (int)keyCloakResponse.StatusCode);

                await userMembershipService.AddAsync(entity);
                await SaveChangesAsync(entity, DbOperation.Create);
            }
            catch (Exception ex)
            {
                await keycloakService.RemoveUserClientRoleAsync(userId, membership.Value.Name);
                if (await userMembershipService.Exists(entity.Id))
                {
                    await userMembershipService.DeleteByIdAsync(entity.Id);
                    await SaveChangesAsync(entity, DbOperation.Delete);
                }

                await paymentService.ReturnPaymentAsync();

                return FailResult<bool>(ex.Message, StatusCodes.Status500InternalServerError);
            }

            return SuccessResult(true, StatusCodes.Status200OK);
        }
    }
}
