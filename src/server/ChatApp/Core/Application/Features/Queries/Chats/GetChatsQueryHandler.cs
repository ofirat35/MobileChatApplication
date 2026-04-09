using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.Chats;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Features.Queries.Users
{
    public class GetChatsQueryHandler(IChatService chatService)
        : BaseQueryHandler, IRequestHandler<GetChatsRequestQuery, PaginatedItemsViewModel<ChatListDto>>
    {
        public async Task<PaginatedItemsViewModel<ChatListDto>> Handle(GetChatsRequestQuery request, CancellationToken cancellationToken)
        {
            var response = await chatService.GetChats(request.Page, request.PageSize);
            return response;
        }
    }

    public class GetChatsRequestQuery : PaginationRequestModel, IRequest<PaginatedItemsViewModel<ChatListDto>>
    {
    }
}
