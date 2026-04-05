using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.AppUsers;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Features.Queries.Users
{
    public class GetInterestedUserProfilesQueryHandler(IAppUserService userService)
        : BaseQueryHandler, IRequestHandler<GetInterestedUserProfilesRequestQuery, PaginatedItemsViewModel<AppUserListDto>>
    {
        public async Task<PaginatedItemsViewModel<AppUserListDto>> Handle(GetInterestedUserProfilesRequestQuery request, CancellationToken cancellationToken)
        {
            var response = await userService.GetInterestedUserProfiles(request.Page, request.PageSize);
            return response;
        }
    }

    public class GetInterestedUserProfilesRequestQuery : PaginationRequestModel, IRequest<PaginatedItemsViewModel<AppUserListDto>>
    {
    }
}
