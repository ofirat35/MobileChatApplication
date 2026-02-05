using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Features.Commands.Swipes
{
    public class SetUserIdsToSwipeCommandHandler(ISwiperService swiperService)
      : BaseQueryHandler, IRequestHandler<SetUserIdsToSwipeRequestCommand, ResponseModel<List<string>>>
    {
        public async Task<ResponseModel<List<string>>> Handle(SetUserIdsToSwipeRequestCommand request, CancellationToken cancellationToken)
        {
            var userPreferencesResponse = await swiperService.GetMatchingPreferences(25);
            if (!userPreferencesResponse.IsSuccess) return ToFailResponseModel<List<string>>(
                userPreferencesResponse.Error, userPreferencesResponse.StatusCode!.Value);

            return ToSuccessResponseModel(userPreferencesResponse.Value!, 201);
        }
    }

    public class SetUserIdsToSwipeRequestCommand : IRequest<ResponseModel<List<string>>>
    {
    }
}
