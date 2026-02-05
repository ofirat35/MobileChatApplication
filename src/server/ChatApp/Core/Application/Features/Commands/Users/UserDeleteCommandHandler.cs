using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Features.Commands.Users
{
    public class UserDeleteCommandHandler(IAppUserService userService, IKeycloakUserService keycloakUserService)
        : BaseQueryHandler, IRequestHandler<UserDeleteRequestCommand, ResponseModel<Unit>>
    {
        public async Task<ResponseModel<Unit>> Handle(UserDeleteRequestCommand request, CancellationToken cancellationToken)
        {
            var keyCloakResponse = await keycloakUserService.DeleteUserAsync(request.Id);
            if (!keyCloakResponse.IsSuccess)
            {
                //logging
                return ToFailResponseModel<Unit>(keyCloakResponse.Error, (int)keyCloakResponse.StatusCode);
            }

            var userResponse = await userService.DeleteAppUserAsync(request.Id);
            if (!userResponse.IsSuccess)
            {
                //logging
                return ToFailResponseModel<Unit>(userResponse.Error, StatusCodes.Status500InternalServerError);
            }

            return ToSuccessResponseModel(Unit.Value, StatusCodes.Status200OK);
        }
    }

    public class UserDeleteRequestCommand : IRequest<ResponseModel<Unit>>
    {
        public string Id { get; set; }
    }
}
