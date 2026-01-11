using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Features.Commands.Auth
{
    public class RegisterCommandHandler(IAuthProvider authProvider) : BaseCommandHandler<UserCreateCommand, ResponseModel<bool>>
    {
        public async Task<ResponseModel<bool>> Handle(
            UserCreateCommand request,
            CancellationToken cancellationToken)
        {
            var response = await authProvider.RegisterAsync(request.Username, request.Password);
            return response.IsSuccess
                ? ToSuccessResponseModel(response.Value, response.StatusCode.Value)
                : ToFailResponseModel<bool>(response.Error, response.StatusCode.Value);
        }
    }

    public class UserCreateCommand : IRequest<ResponseModel<bool>>
    {
        public string Username { get; init; } = default!;
        public string Password { get; init; } = default!;
    }
}
