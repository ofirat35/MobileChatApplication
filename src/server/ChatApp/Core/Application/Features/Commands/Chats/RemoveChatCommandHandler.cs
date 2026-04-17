using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.Chats;
using ChatApp.Core.Domain.Models;
using ChatApp.Extensions;
using MediatR;

namespace ChatApp.Core.Application.Features.Commands.Chats
{
    public class RemoveChatCommandHandler(
        IChatService chatService)
        : BaseCommandHandler, IRequestHandler<RemoveChatRequestCommand, ResponseModel<ChatListDto>>
    {
        public async Task<ResponseModel<ChatListDto>> Handle(RemoveChatRequestCommand request, CancellationToken cancellationToken)
        {
            var chatResult = await chatService.RemoveSelectedChatsAsync([request.ChatId]);
            if (!chatResult.IsSuccess) return ToFailResponseModel<ChatListDto>(chatResult.Error, chatResult.StatusCode);

            return ToSuccessResponseModel(chatResult.Value[0], StatusCodes.Status200OK);
        }
    }

    public class RemoveChatRequestCommand : IRequest<ResponseModel<ChatListDto>>
    {
        public Guid ChatId { get; set; }
    }
}
