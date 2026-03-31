using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Models;
using ChatApp.Extensions;
using MediatR;

namespace ChatApp.Core.Application.Features.Commands.Memberships
{
    public class BuyMembershipCommandHandler(IMembershipService membershipService, IHttpContextAccessor httpContext)
        : BaseCommandHandler, IRequestHandler<BuyMembershipRequestCommand, ResponseModel<bool>>
    {
        public async Task<ResponseModel<bool>> Handle(BuyMembershipRequestCommand request, CancellationToken cancellationToken)
        {
            var result = await membershipService.BuyMembershipAsync(request.MembershipId, httpContext.GetUserId(), request.Duration);
            return result.IsSuccess
                ? ToSuccessResponseModel(result.Value, StatusCodes.Status201Created)
                : ToFailResponseModel<bool>(result.Error, result.StatusCode);
        }
    }

    public class BuyMembershipRequestCommand : IRequest<ResponseModel<bool>>
    {
        public Guid MembershipId { get; set; }
        public byte Duration { get; set; }
    }
}
