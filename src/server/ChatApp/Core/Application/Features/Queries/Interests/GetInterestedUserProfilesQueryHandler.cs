using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.AppUsers;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Features.Queries.Interests
{
    public class GetInterestedUserProfilesQueryHandler(IUserProfileService interestsService)
        : BaseQueryHandler, IRequestHandler<GetInterestedUserProfilesQuery, PaginatedItemsViewModel<InterestedUserProfile>>
    {
        public async Task<PaginatedItemsViewModel<InterestedUserProfile>> Handle(GetInterestedUserProfilesQuery request, CancellationToken cancellationToken)
        {
            var response = await interestsService.GetInterestedUserProfiles(request.Page, request.PageSize);
            return response;
        }
    }

    public class GetInterestedUserProfilesQuery : PaginationRequestModel, IRequest<PaginatedItemsViewModel<InterestedUserProfile>>
    {
    }
}
