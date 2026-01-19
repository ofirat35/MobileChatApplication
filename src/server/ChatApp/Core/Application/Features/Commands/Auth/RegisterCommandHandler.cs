using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.Users;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Features.Commands.Auth
{
    public class RegisterCommandHandler(IAuthProvider authProvider)
        : BaseQueryHandler,
        IRequestHandler<UserCreateCommand, ResponseModel<bool>>
    {
        public async Task<ResponseModel<bool>> Handle(UserCreateCommand request, CancellationToken cancellationToken)
        {
            var response = await authProvider.RegisterAsync(request.User);
            return response.IsSuccess
                ? ToSuccessResponseModel(response.Value, response.StatusCode.Value)
                : ToFailResponseModel<bool>(response.Error, ResolveStatusCode(response));
        }
    }

    public class UserCreateCommand : IRequest<ResponseModel<bool>>
    {
        public UserCreateDto User { get; set; } = default!;
    }
}
