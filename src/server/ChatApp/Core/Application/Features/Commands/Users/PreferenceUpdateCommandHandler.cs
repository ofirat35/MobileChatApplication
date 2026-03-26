using AutoMapper;
using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.Preferences;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Features.Commands.Users
{
    public class PreferenceUpdateCommandHandler(
        IAppUserService userService, 
        ISwiperService swiperService, 
        IMapper mapper)
       : BaseCommandHandler, IRequestHandler<PreferenceUpdateRequestCommand, ResponseModel<Unit>>
    {
        public async Task<ResponseModel<Unit>> Handle(PreferenceUpdateRequestCommand request, CancellationToken cancellationToken)
        {
            var mappedPreference = mapper.Map<PreferenceUpdateDto>(request.Preferences);
            await swiperService.ClearMatchingPreferencesCache();
            var result = await userService.UpdateAppUserPreferencesAsync(mappedPreference);
            return result.IsSuccess
                ? ToSuccessResponseModel(Unit.Value)
                : ToFailResponseModel<Unit>(result.Error, result.StatusCode);

        }
    }

    public class PreferenceUpdateRequestCommand : IRequest<ResponseModel<Unit>>
    {
        public PreferenceUpdateDto Preferences { get; set; }
    }
}
