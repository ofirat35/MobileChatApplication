using ChatApp.Core.Application.Extensions;
using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Models;
using ChatApp.Infrastructure.Services;
using MediatR;

namespace ChatApp.Core.Application.Features.Commands.Memberships
{
    public class RemoveMembershipCommandHandler(
        IMembershipService membershipService)
        : BaseCommandHandler, IRequestHandler<RemoveMembershipRequestCommand, ResponseModel<Unit>>
    {
        public async Task<ResponseModel<Unit>> Handle(RemoveMembershipRequestCommand request, CancellationToken cancellationToken)
        {
            var membership = await membershipService.GetSingleAsync(_ => _.Id == request.Id && _.IsValid);
            if (membership is null) 
                return ToFailResponseModel<Unit>(LoggerMessages.EntityNotFound, StatusCodes.Status404NotFound);

            await membershipService.DeleteMembershipAsync(membership.Id);
            await membershipService.SaveChangesAsync();

            return ToSuccessResponseModel(Unit.Value, StatusCodes.Status200OK);
        }
    }

    public class RemoveMembershipRequestCommand : IRequest<ResponseModel<Unit>>
    {
        public Guid Id { get; set; }
    }
}
