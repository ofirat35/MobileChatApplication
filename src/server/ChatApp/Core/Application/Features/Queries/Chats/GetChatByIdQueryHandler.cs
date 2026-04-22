using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.Chats;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Features.Queries.Users
{
    public class GetChatByIdQueryHandler(IChatService chatService)
        : BaseQueryHandler, IRequestHandler<GetChatByIdRequestQuery, ResponseModel<ChatListDto>>
    {
        public async Task<ResponseModel<ChatListDto>> Handle(GetChatByIdRequestQuery request, CancellationToken cancellationToken)
        {
            var response = await chatService.GetChatByIdAsync(request.Id);
            return ToSuccessResponseModel(response.Value);
        }
    }

    public class GetChatByIdRequestQuery : PaginationRequestModel, IRequest<ResponseModel<ChatListDto>>
    {
        public Guid Id { get; set; }
    }
}
