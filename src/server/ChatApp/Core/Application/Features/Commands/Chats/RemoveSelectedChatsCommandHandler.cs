using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.Chats;
using ChatApp.Core.Domain.Models;
using ChatApp.Extensions;
using MediatR;

namespace ChatApp.Core.Application.Features.Commands.Chats
{
    public class RemoveSelectedChatsCommandHandler(IChatService chatService)
        : BaseCommandHandler, IRequestHandler<RemoveSelectedChatsRequestCommand, ResponseModel<List<ChatListDto>>>
    {
        public async Task<ResponseModel<List<ChatListDto>>> Handle(RemoveSelectedChatsRequestCommand request, CancellationToken cancellationToken)
        {
            var chatResult = await chatService.RemoveSelectedChatsAsync(request.ChatIds);
            if (!chatResult.IsSuccess) return ToFailResponseModel<List<ChatListDto>>(chatResult.Error, chatResult.StatusCode);

            return ToSuccessResponseModel(chatResult.Value, StatusCodes.Status200OK);
        }
    }

    public class RemoveSelectedChatsRequestCommand : IRequest<ResponseModel<List<ChatListDto>>>
    {
        public List<Guid> ChatIds { get; set; }
    }
}
