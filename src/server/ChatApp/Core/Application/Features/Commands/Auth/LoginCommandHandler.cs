using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.Auth;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Features.Commands.Auth
{
    public class LoginCommandHandler(IAuthProvider authProvider)
        : BaseQueryHandler,
        IRequestHandler<LoginCommand, ResponseModel<TokenResponse>>
    {
        public async Task<ResponseModel<TokenResponse>> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            var response = await authProvider.LoginAsync(request.User);
            return response.IsSuccess
              ? ToSuccessResponseModel(response.Value!, response.StatusCode.Value)
              : ToFailResponseModel<TokenResponse>(response.Error, ResolveStatusCode(response));
        }

    }

    public class LoginCommand : IRequest<ResponseModel<TokenResponse>>
    {
        public LoginDto User{ get; set; }
    }
}
