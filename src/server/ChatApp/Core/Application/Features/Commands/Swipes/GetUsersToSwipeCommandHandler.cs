using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.AppUsers;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Features.Commands.Swipes
{
    public class GetUsersToSwipeCommandHandler(ISwiperService swiperService)
      : BaseQueryHandler, IRequestHandler<GetUsersToSwipeRequestCommand, ResponseModel<List<UserProfile>>>
    {
        public async Task<ResponseModel<List<UserProfile>>> Handle(GetUsersToSwipeRequestCommand request, CancellationToken cancellationToken)
        {
            var userPreferencesResponse = await swiperService.GetMatchingPreferences(request.Count, request.Offset);
            if (!userPreferencesResponse.IsSuccess) return ToFailResponseModel<List<UserProfile>>(
                userPreferencesResponse.Error, userPreferencesResponse.StatusCode!.Value);

            return ToSuccessResponseModel(userPreferencesResponse.Value!, StatusCodes.Status201Created);
        }
    }

    public class GetUsersToSwipeRequestCommand : IRequest<ResponseModel<List<UserProfile>>>
    {
        public int Count { get; set; }
        public int? Offset { get; set; }
    }
}
