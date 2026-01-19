using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.Users;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Features.Commands.Users
{
    public class UpdateUserCommandHandler(IUserService userService)
        : BaseQueryHandler, IRequestHandler<UpdateUserCommand, ResponseModel<Unit>>
    {
        public async Task<ResponseModel<Unit>> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
        {
            var response = await userService.UpdateUserAsync(request.User, request.Id);
            return response.IsSuccess
                 ? ToSuccessResponseModel(response.Value, 200)
                 : ToFailResponseModel<Unit>(response.Error, 404);
        }
    }

    public class UpdateUserCommand : IRequest<ResponseModel<Unit>>
    {
        public string Id { get; set; }
        public UserUpdateDto User { get; set; }
    }
}
