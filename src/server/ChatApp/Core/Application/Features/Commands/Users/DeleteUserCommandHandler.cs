using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Features.Commands.Users
{
    public class DeleteUserCommandHandler(IUserService userService)
        : BaseQueryHandler, IRequestHandler<DeleteUserCommand, ResponseModel<Unit>>
    {
        public async Task<ResponseModel<Unit>> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
        {
            var response = await userService.DeleteUserAsync(request.Id);
            return response.IsSuccess
                 ? ToSuccessResponseModel(response.Value, (int)response.StatusCode)
                 : ToFailResponseModel<Unit>(response.Error, (int)response.StatusCode);
        }
    }

    public class DeleteUserCommand : IRequest<ResponseModel<Unit>>
    {
        public string Id { get; set; }
    }
}
