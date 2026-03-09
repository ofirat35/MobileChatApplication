using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Features.Commands.Memberships
{
    public class RemoveMembershipCommandHandler(
        IMembershipService membershipService)
        : BaseQueryHandler, IRequestHandler<RemoveMembershipRequestCommand, ResponseModel<Unit>>
    {
        public async Task<ResponseModel<Unit>> Handle(RemoveMembershipRequestCommand request, CancellationToken cancellationToken)
        {
            var membership = await membershipService.GetSingleAsync(_ => _.Id == request.Id && _.IsValid);
            if(membership is null) return ToFailResponseModel<Unit>("Membership not found!", StatusCodes.Status404NotFound);
            
            membership.IsValid = false;
            await membershipService.SaveChangesAsync();

            return ToSuccessResponseModel(Unit.Value, StatusCodes.Status200OK);
        }
    }

    public class RemoveMembershipRequestCommand : IRequest<ResponseModel<Unit>>
    {
        public Guid Id { get; set; }
    }
}
