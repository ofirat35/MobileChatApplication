using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.AppUsers;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Features.Commands.Swipes
{
    public class GetUsersToSwipeCommandHandler(ISwiperService swiperService)
      : BaseCommandHandler, IRequestHandler<GetUsersToSwipeRequestCommand, ResponseModel<List<UserProfile>>>
    {
        public async Task<ResponseModel<List<UserProfile>>> Handle(GetUsersToSwipeRequestCommand request, CancellationToken cancellationToken)
        {
            var response = await swiperService.GetMatchingPreferences(request.Count, request.ExcludedUserIds);
            return response.IsSuccess
                ? ToSuccessResponseModel(response.Value)
                : ToFailResponseModel<List<UserProfile>>(response.Error, response.StatusCode);
        }
    }

    public class GetUsersToSwipeRequestCommand : IRequest<ResponseModel<List<UserProfile>>>
    {
        public int Count { get; set; }
        public List<string>? ExcludedUserIds { get; set; }
    }
}
