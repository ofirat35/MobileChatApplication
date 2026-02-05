using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.AppUsers;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Features.Queries.Users
{
    public class GetUserByIdQueryHandler(IAppUserService userService)
        : BaseQueryHandler, IRequestHandler<GetUserByIdQuery, ResponseModel<AppUserListDto>>
    {
        public async Task<ResponseModel<AppUserListDto>> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
        {
            var response = await userService.GetAppUserByIdAsync(request.Id);
            return response.IsSuccess
                 ? ToSuccessResponseModel(response.Value!, 200)
                 : ToFailResponseModel<AppUserListDto>(response.Error!, 404);
        }
    }

    public class GetUserByIdQuery : IRequest<ResponseModel<AppUserListDto>>
    {
        public string Id { get; set; }
    }
}
