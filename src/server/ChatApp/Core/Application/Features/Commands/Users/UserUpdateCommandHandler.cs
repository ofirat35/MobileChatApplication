using AutoMapper;
using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.AppUsers;
using ChatApp.Core.Domain.Dtos.Auth;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Features.Commands.Users
{
    public class UserUpdateCommandHandler(
        IAppUserService userService,
        IKeycloakUserService keycloakUserService,
        IMapper mapper)
        : BaseQueryHandler, IRequestHandler<UserUpdateRequestCommand, ResponseModel<Unit>>
    {
        public async Task<ResponseModel<Unit>> Handle(UserUpdateRequestCommand request, CancellationToken cancellationToken)
        {
            var keyCloakModel = mapper.Map<KeyCloakUserUpdateDto>(request);
            var userModel = mapper.Map<AppUserUpdateDto>(request);

            var keyCloakResponse = await keycloakUserService.UpdateUserAsync(keyCloakModel, request.Id);
            if (!keyCloakResponse.IsSuccess)
            {
                //logging
                return ToFailResponseModel<Unit>(keyCloakResponse.Error, (int)keyCloakResponse.StatusCode);
            }

            var userResponse = await userService.UpdateAppUserAsync(userModel);
            if (!userResponse.IsSuccess)
            {
                //logging
                return ToFailResponseModel<Unit>(userResponse.Error, StatusCodes.Status500InternalServerError);
            }

            return ToSuccessResponseModel(Unit.Value, 200);
        }
    }

    public class UserUpdateRequestCommand : IRequest<ResponseModel<Unit>>
    {
        public string Id { get; set; }
        // Auth
        public string Email { get; set; }

        // Profile
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? Bio { get; set; }
        public DateOnly BirthDate { get; set; }
    }
}
