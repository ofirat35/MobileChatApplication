using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.Preferences;
using ChatApp.Core.Domain.Models;
using ChatApp.Extensions;
using MediatR;

namespace ChatApp.Core.Application.Features.Queries.Users
{
    public class GetPreferenceByIdQueryHandler(IAppUserService userService, IHttpContextAccessor httpContext)
        : BaseQueryHandler, IRequestHandler<GetPreferenceRequestQuery, ResponseModel<PreferenceListDto>>
    {
        public async Task<ResponseModel<PreferenceListDto>> Handle(GetPreferenceRequestQuery request, CancellationToken cancellationToken)
        {
            var userId = httpContext.GetUserId();
            var response = await userService.GetAppUserPreferenceByIdAsync(userId);
            return response.IsSuccess
                 ? ToSuccessResponseModel(response.Value!, 200)
                 : ToFailResponseModel<PreferenceListDto>(response.Error!, (int)response.StatusCode);
        }
    }

    public class GetPreferenceRequestQuery : IRequest<ResponseModel<PreferenceListDto>>
    {
    }
}
