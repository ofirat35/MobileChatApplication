using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Entities;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Features.Queries.Users
{
    public class GetMembershipRequestQueryHandler(IMembershipService membershipService)
        : BaseQueryHandler, IRequestHandler<GetMembershipRequestQuery, ResponseModel<List<Membership>>>
    {
        public async Task<ResponseModel<List<Membership>>> Handle(GetMembershipRequestQuery request, CancellationToken cancellationToken)
        {
            var response = await membershipService.GetActiveMembershipsAsync();
            return response.IsSuccess
                ? ToSuccessResponseModel(response.Value)
                : ToFailResponseModel<List<Membership>>(response.Error, response.StatusCode);
        }

    }

    public class GetMembershipRequestQuery : IRequest<ResponseModel<List<Membership>>>
    {
    }
}
