using AutoMapper;
using ChatApp.Core.Application.Enums;
using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.AppUsers;
using ChatApp.Core.Domain.Dtos.Auth;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Features.Commands.Auth
{
    public class RegisterCommandHandler(
        IKeycloakUserService keyCloakService,
        IAppUserService userService,
        IMapper mapper,
        ILogger<RegisterCommandHandler> logger)
        : BaseCommandHandler, IRequestHandler<RegisterUserRequestCommand, ResponseModel<bool>>
    {
        public async Task<ResponseModel<bool>> Handle(RegisterUserRequestCommand request, CancellationToken cancellationToken)
        {
            var keyCloakUserId = "";
            var keyCloakModel = mapper.Map<KeycloakUserCreateRequestDto>(request);
            var appModel = mapper.Map<AppUserCreateDto>(request);
            try
            {
                var keycloakResponse = await keyCloakService.CreateUserAsync(keyCloakModel);
                if (!keycloakResponse.IsSuccess)
                {
                    return ToFailResponseModel<bool>(
                    keycloakResponse.Error, keycloakResponse.StatusCode!.Value);
                }
                keyCloakUserId = keycloakResponse.Value!;

                appModel.Id = keyCloakUserId;
                var userResponse = await userService.CreateAppUserAsync(appModel);
                if (!userResponse.IsSuccess)
                {
                    await keyCloakService.DeleteUserAsync(keyCloakUserId);
                    return ToFailResponseModel<bool>(userResponse.Error, ResolveStatusCode(userResponse));
                }

                return ToSuccessResponseModel(userResponse.Value, StatusCodes.Status201Created);
            }
            catch (Exception ex)
            {
                return ToFailResponseModel<bool>(ex.Message, StatusCodes.Status500InternalServerError);
            }
        }

    }

    public class RegisterUserRequestCommand : IRequest<ResponseModel<bool>>
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public GenderEnum Gender { get; set; }
        public DateOnly BirthDate { get; set; }
    }
}
