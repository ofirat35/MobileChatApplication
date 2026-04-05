using ChatApp.Core.Application.Features.Commands;
using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.AppUsers;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Features.Queries.Swipes
{
    public class GetUsersToSwipeQueryHandler(ISwiperService swiperService)
      : BaseCommandHandler, IRequestHandler<GetUsersToSwipeRequestQuery, ResponseModel<List<AppUserListDto>>>
    {
        public async Task<ResponseModel<List<AppUserListDto>>> Handle(GetUsersToSwipeRequestQuery request, CancellationToken cancellationToken)
        {
            var response = await swiperService.GetMatchingPreferences(request.Count, request.ExcludedUserIds);
            return response.IsSuccess
                ? ToSuccessResponseModel(response.Value)
                : ToFailResponseModel<List<AppUserListDto>>(response.Error, response.StatusCode);
        }
    }

    public class GetUsersToSwipeRequestQuery : IRequest<ResponseModel<List<AppUserListDto>>>
    {
        public int Count { get; set; }
        public List<string>? ExcludedUserIds { get; set; }
    }
}
