using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Entities;
using ChatApp.Core.Domain.Models;
using ChatApp.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Core.Application.Features.Commands.Memberships
{
    public class CreateMembershipCommandHandler(IMembershipService membershipService)
        : BaseQueryHandler, IRequestHandler<CreateMembershipRequestCommand, ResponseModel<Unit>>
    {
        public async Task<ResponseModel<Unit>> Handle(CreateMembershipRequestCommand request, CancellationToken cancellationToken)
        {
            var membershipExists = await membershipService.GetSingleAsync(_ => _.Name == request.Name && _.IsValid);
            if (membershipExists is not null)
                return ToFailResponseModel<Unit>("Membership already exists", StatusCodes.Status409Conflict);

            await membershipService.AddAsync(new Membership { Name = request.Name, Price = request.Price, IsValid = true });
            await membershipService.SaveChangesAsync();

            return ToSuccessResponseModel(Unit.Value, StatusCodes.Status201Created);
        }
    }

    public class CreateMembershipRequestCommand : IRequest<ResponseModel<Unit>>
    {
        public string Name { get; set; }
        public float Price { get; set; }
    }
}
