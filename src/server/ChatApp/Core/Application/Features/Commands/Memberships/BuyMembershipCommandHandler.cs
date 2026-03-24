using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Entities;
using ChatApp.Core.Domain.Models;
using ChatApp.Extensions;
using MediatR;

namespace ChatApp.Core.Application.Features.Commands.Memberships
{
    public class BuyMembershipCommandHandler(
        IUserMembershipService userMembershipService,
        IMembershipService membershipService,
        IKeycloakUserService keycloakUserService,
        IHttpContextAccessor httpContext)
        : BaseCommandHandler, IRequestHandler<BuyMembershipRequestCommand, ResponseModel<bool>>
    {
        public async Task<ResponseModel<bool>> Handle(BuyMembershipRequestCommand request, CancellationToken cancellationToken)
        {
            var userId = httpContext.GetUserId();
            var paymentStatus = Payment();
            if (!paymentStatus)
                return ToFailResponseModel<bool>("Error during payment procces!", StatusCodes.Status400BadRequest);

            var userMembership = await userMembershipService.HasMembership(request.Membership, userId);
            if (userMembership != null)
                return ToFailResponseModel<bool>("User membership already exists!", StatusCodes.Status400BadRequest);

            var membership = await membershipService.GetSingleAsync(_ => _.Name == request.Membership && _.IsValid);
            if (membership == null)
                return ToFailResponseModel<bool>("Membership not found!", StatusCodes.Status404NotFound);

            var entity = new UserMembership
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                MembershipId = membership.Id,
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddMonths(request.Duration),
                TotalAmount = membership.Price * request.Duration,
                MembershipEnded = false
            };

            try
            {
                var keyCloakResponse = await keycloakUserService.AssignRealmRoleAsync(userId, request.Membership);
                if (!keyCloakResponse.IsSuccess)
                {
                    //log
                    return ToFailResponseModel<bool>(keyCloakResponse.Error, (int)keyCloakResponse.StatusCode);
                }

                await userMembershipService.AddAsync(entity);
                await userMembershipService.SaveChangesAsync();
            }
            catch
            {
                var result = await keycloakUserService.RemoveUserRealmRoleAsync(userId, request.Membership);
                if (await userMembershipService.Exists(entity.Id))
                {
                    await userMembershipService.DeleteByIdAsync(entity.Id);
                    await userMembershipService.SaveChangesAsync();
                }

                ReturnPayment();

                return ToFailResponseModel<bool>("Error occured", StatusCodes.Status500InternalServerError);
            }

            return ToSuccessResponseModel(true, StatusCodes.Status200OK);
        }

        public bool Payment()
        {
            return true;
        }

        public bool ReturnPayment()
        {
            return true;
        }
    }

    public class BuyMembershipRequestCommand : IRequest<ResponseModel<bool>>
    {
        public string Membership { get; set; }
        public byte Duration { get; set; }
    }
}
