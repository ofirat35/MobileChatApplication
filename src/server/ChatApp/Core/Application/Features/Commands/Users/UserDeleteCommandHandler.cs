using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Features.Commands.Users
{
    public class UserDeleteCommandHandler(IAppUserService userService, IKeycloakUserService keycloakUserService)
        : BaseCommandHandler, IRequestHandler<UserDeleteRequestCommand, ResponseModel<Unit>>
    {
        public async Task<ResponseModel<Unit>> Handle(UserDeleteRequestCommand request, CancellationToken cancellationToken)
        {
            var keyCloakResponse = await keycloakUserService.DeleteUserAsync(request.Id);
            if (!keyCloakResponse.IsSuccess)
                return ToFailResponseModel<Unit>(keyCloakResponse.Error, keyCloakResponse.StatusCode);

            var userResponse = await userService.DeleteAppUserAsync(request.Id);
            if (!userResponse.IsSuccess)
                return ToFailResponseModel<Unit>(userResponse.Error, userResponse.StatusCode);

            return ToSuccessResponseModel(Unit.Value);
        }
    }

    public class UserDeleteRequestCommand : IRequest<ResponseModel<Unit>>
    {
        public string Id { get; set; }
    }
}
