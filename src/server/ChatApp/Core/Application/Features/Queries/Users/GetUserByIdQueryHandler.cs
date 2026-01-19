using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.Users;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Features.Queries.Users
{
    public class GetUserByIdQueryHandler(IUserService userService)
        : BaseQueryHandler, IRequestHandler<GetUserByIdQuery, ResponseModel<UserListDto>>
    {
        public async Task<ResponseModel<UserListDto>> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
        {
            var response = await userService.GetUserByIdAsync(request.Id);
            return response.IsSuccess
                 ? ToSuccessResponseModel(response.Value!, 200)
                 : ToFailResponseModel<UserListDto>(response.Error!, 404);
        }
    }

    public class GetUserByIdQuery : IRequest<ResponseModel<UserListDto>>
    {
        public string Id { get; set; }
    }
}
