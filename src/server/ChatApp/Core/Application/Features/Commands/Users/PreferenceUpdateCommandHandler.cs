using AutoMapper;
using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.Preferences;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Features.Commands.Users
{
    public class PreferenceUpdateCommandHandler(IAppUserService userService, IMapper mapper)
       : BaseQueryHandler, IRequestHandler<PreferenceUpdateRequestCommand, ResponseModel<Unit>>
    {
        public async Task<ResponseModel<Unit>> Handle(PreferenceUpdateRequestCommand request, CancellationToken cancellationToken)
        {
            var mappedPreference = mapper.Map<PreferenceUpdateDto>(request.Preferences);
            var result = await userService.UpdateAppUserPreferencesAsync(mappedPreference);
            if (!result.IsSuccess)
            {
                //logging
                return ToFailResponseModel<Unit>(result.Error, (int)result.StatusCode);
            }

            return ToSuccessResponseModel(Unit.Value, StatusCodes.Status200OK);
        }
    }

    public class PreferenceUpdateRequestCommand : IRequest<ResponseModel<Unit>>
    {
        public PreferenceUpdateDto Preferences { get; set; }
    }
}
