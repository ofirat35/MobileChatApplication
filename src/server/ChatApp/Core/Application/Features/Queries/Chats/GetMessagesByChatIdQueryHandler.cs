using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.Chats;
using ChatApp.Core.Domain.Dtos.Messages;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Features.Queries.Chats
{
    public class GetMessagesByChatIdQueryHandler(IChatService chatService)
        : BaseQueryHandler, IRequestHandler<GetMessagesByChatIdRequestQuery, PaginatedItemsViewModel<MessageListDto>>
    {
        public async Task<PaginatedItemsViewModel<MessageListDto>> Handle(GetMessagesByChatIdRequestQuery request, CancellationToken cancellationToken)
        {
            var response = await chatService.GetMessagesByChatId(request.ChatId, request.Page, request.PageSize);
            return response;
        }
    }

    public class GetMessagesByChatIdRequestQuery : PaginationRequestModel, IRequest<PaginatedItemsViewModel<MessageListDto>>
    {
        public Guid ChatId { get; set; }
    }
}
