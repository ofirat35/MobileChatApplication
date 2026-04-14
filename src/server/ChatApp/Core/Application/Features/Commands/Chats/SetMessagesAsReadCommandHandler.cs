using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Features.Commands.Chats
{
    public class SetMessagesAsReadCommandHandler(
        IMessageService messageService)
       : BaseCommandHandler, IRequestHandler<SetMessagesAsReadRequestCommand, ResponseModel<int>>
    {
        public async Task<ResponseModel<int>> Handle(SetMessagesAsReadRequestCommand request, CancellationToken cancellationToken)
        {
            var matchResult = await messageService.SetMessagesAsReadAsync(request.ChatId);
            return ToSuccessResponseModel(matchResult.Value, StatusCodes.Status200OK);
        }
    }

    public class SetMessagesAsReadRequestCommand : IRequest<ResponseModel<int>>
    {
        public Guid ChatId { get; set; }
    }
}
