using AutoMapper;
using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.Chats;
using ChatApp.Core.Domain.Models;
using ChatApp.Extensions;
using MediatR;

namespace ChatApp.Core.Application.Features.Queries.Chats
{
    public class ChatExistsWithUserQueryHandler(IChatService chatService)
        : BaseQueryHandler, IRequestHandler<ChatExistsWithUserRequestQuery, ResponseModel<ChatListDto>>
    {
        public async Task<ResponseModel<ChatListDto>> Handle(ChatExistsWithUserRequestQuery request, CancellationToken cancellationToken)
        {
            var response = await chatService.ChatExistsWithUser(request.UserId);
            return ToSuccessResponseModel(response.Value);
        }
    }

    public class ChatExistsWithUserRequestQuery : IRequest<ResponseModel<ChatListDto>>
    {
        public string UserId { get; set; }
    }
}
