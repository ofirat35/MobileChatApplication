using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.Chats;
using ChatApp.Core.Domain.Dtos.Messages;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Features.Queries.Chats
{
    public class GetChatByIdQueryHandler(IChatService chatService)
        : BaseQueryHandler, IRequestHandler<GetChatByIdRequestQuery, PaginatedItemsViewModel<MessageListDto>>
    {
        public async Task<PaginatedItemsViewModel<MessageListDto>> Handle(GetChatByIdRequestQuery request, CancellationToken cancellationToken)
        {
            var response = await chatService.GetChatById(request.ChatId, request.Page, request.PageSize);
            return response;
        }
    }

    public class GetChatByIdRequestQuery : PaginationRequestModel, IRequest<PaginatedItemsViewModel<MessageListDto>>
    {
        public Guid ChatId { get; set; }
    }
}
