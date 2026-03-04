using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.AppUsers;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Features.Queries.Users
{
    public class GetMatchesQueryHandler(IMatchService matchService)
        : BaseQueryHandler, IRequestHandler<GetMatchesRequestQuery, PaginatedItemsViewModel<UserProfile>>
    {
        public async Task<PaginatedItemsViewModel<UserProfile>> Handle(GetMatchesRequestQuery request, CancellationToken cancellationToken)
        {
            var response = await matchService.GetMatches(request.Page, request.PageSize);
            return response;
        }
    }

    public class GetMatchesRequestQuery :PaginationRequestModel,  IRequest<PaginatedItemsViewModel<UserProfile>>
    {
    }
}
