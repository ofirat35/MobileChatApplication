using AutoMapper;
using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.Chats;
using ChatApp.Core.Domain.Models;
using ChatApp.Extensions;
using MediatR;

namespace ChatApp.Core.Application.Features.Queries.Chats
{
    public class ChatExistsWithUserQueryHandler(
        IChatService chatService,
        IMapper mapper,
        IHttpContextAccessor httpContext)
        : BaseQueryHandler, IRequestHandler<ChatExistsWithUserRequestQuery, ResponseModel<ChatListDto>>
    {
        public async Task<ResponseModel<ChatListDto>> Handle(ChatExistsWithUserRequestQuery request, CancellationToken cancellationToken)
        {
            var activeUserId = httpContext.GetUserId();
            var response = await chatService.GetSingleAsync(_ => 
                ((_.FromUserId == activeUserId && _.ToUserId == request.UserId)
                || (_.FromUserId == request.UserId && _.ToUserId == activeUserId)) && _.IsValid);
            if(response is null)
                return ToSuccessResponseModel<ChatListDto> (null);

            return ToSuccessResponseModel(mapper.Map<ChatListDto>(response));
        }
    }

    public class ChatExistsWithUserRequestQuery : IRequest<ResponseModel<ChatListDto>>
    {
        public string UserId { get; set; }
    }
}
