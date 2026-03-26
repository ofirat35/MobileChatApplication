using ChatApp.Core.Application.Extensions;
using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Entities;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Features.Commands.Memberships
{
    public class CreateMembershipCommandHandler(IMembershipService membershipService)
        : BaseCommandHandler, IRequestHandler<CreateMembershipRequestCommand, ResponseModel<Unit>>
    {
        public async Task<ResponseModel<Unit>> Handle(CreateMembershipRequestCommand request, CancellationToken cancellationToken)
        {
            var result = await membershipService.CreateMembershipAsync(
                new Membership { 
                    Name = request.Name, 
                    Price = request.Price, 
                });
            return result.IsSuccess
                ? ToSuccessResponseModel(Unit.Value, StatusCodes.Status201Created)
                : ToFailResponseModel<Unit>(result.Error, result.StatusCode);
        }
    }

    public class CreateMembershipRequestCommand : IRequest<ResponseModel<Unit>>
    {
        public string Name { get; set; }
        public float Price { get; set; }
    }
}
