using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.Auth;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Features.Commands.Auth
{
    public class LoginCommandHandler(IAuthProvider authProvider)
        : BaseCommandHandler<LoginCommand, ResponseModel<TokenResponse>>
    {
        public async Task<ResponseModel<TokenResponse>> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            var response = await authProvider.LoginAsync(request.Username, request.Password);
            return response.IsSuccess
              ? ToSuccessResponseModel(response.Value!, response.StatusCode.Value)
              : ToFailResponseModel<TokenResponse>(response.Error, response.StatusCode.Value);
        }

    }

    public class LoginCommand : IRequest<ResponseModel<TokenResponse>>
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
