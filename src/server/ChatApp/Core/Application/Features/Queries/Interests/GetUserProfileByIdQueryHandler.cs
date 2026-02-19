using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.AppUsers;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Features.Queries.Interests
{
    public class GetUserProfileByIdQueryHandler(IUserProfileService interestsService)
        : BaseQueryHandler, IRequestHandler<GetUserProfileByIdQuery, ResponseModel<InterestedUserProfile>>
    {
        public async Task<ResponseModel<InterestedUserProfile>> Handle(GetUserProfileByIdQuery request, CancellationToken cancellationToken)
        {
            var response = await interestsService.GetUserProfile(request.UserId);

            return response.IsSuccess
                 ? ToSuccessResponseModel(response.Value!, StatusCodes.Status200OK)
                 : ToFailResponseModel<InterestedUserProfile>(response.Error!, (int)response.StatusCode); ;
        }
    }

    public class GetUserProfileByIdQuery : PaginationRequestModel, IRequest<ResponseModel<InterestedUserProfile>>
    {
        public string UserId { get; set; }
    }
}
