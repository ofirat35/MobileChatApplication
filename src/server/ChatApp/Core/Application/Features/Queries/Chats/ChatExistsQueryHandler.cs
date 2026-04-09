using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Models;
using ChatApp.Extensions;
using MediatR;

namespace ChatApp.Core.Application.Features.Queries.Chats
{
    public class ChatExistsQueryHandler(
        IChatService chatService,
        IHttpContextAccessor httpContext)
        : BaseQueryHandler, IRequestHandler<ChatExistsRequestQuery, ResponseModel<bool>>
    {
        public async Task<ResponseModel<bool>> Handle(ChatExistsRequestQuery request, CancellationToken cancellationToken)
        {
            var activeUserId = httpContext.GetUserId();
            var response = chatService.Any(_ => 
                ((_.FromUserId == activeUserId && _.ToUserId == request.UserId)
                || (_.FromUserId == request.UserId && _.ToUserId == activeUserId)) && _.IsValid);
            return ToSuccessResponseModel(response);
        }

    }

    public class ChatExistsRequestQuery : IRequest<ResponseModel<bool>>
    {
        public string UserId { get; set; }
    }
}
