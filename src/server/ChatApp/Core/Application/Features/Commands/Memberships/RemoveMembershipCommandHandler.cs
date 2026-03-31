using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Features.Commands.Memberships
{
    public class RemoveMembershipCommandHandler(
        IMembershipService membershipService)
        : BaseCommandHandler, IRequestHandler<RemoveMembershipRequestCommand, ResponseModel<Unit>>
    {
        public async Task<ResponseModel<Unit>> Handle(RemoveMembershipRequestCommand request, CancellationToken cancellationToken)
        {
            var result = await membershipService.DeleteMembershipAsync(request.Id);
            return result.IsSuccess
                ? ToSuccessResponseModel(Unit.Value)
                : ToFailResponseModel<Unit>(result.Error, result.StatusCode);
        }
    }

    public class RemoveMembershipRequestCommand : IRequest<ResponseModel<Unit>>
    {
        public Guid Id { get; set; }
    }
}
