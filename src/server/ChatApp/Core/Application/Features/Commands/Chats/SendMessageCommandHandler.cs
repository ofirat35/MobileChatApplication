using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.Messages;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Features.Commands.Chats
{
    public class SendMessageCommandHandler(
        IMessageService messageService)
      : BaseCommandHandler, IRequestHandler<SendMessageRequestCommand, ResponseModel<Guid>>
    {
        public async Task<ResponseModel<Guid>> Handle(SendMessageRequestCommand request, CancellationToken cancellationToken)
        {
            var response = await messageService.SendMessageAsync(request);
            return response.IsSuccess
                ? ToSuccessResponseModel(response.Value, StatusCodes.Status201Created)
                : ToFailResponseModel<Guid>(response.Error, response.StatusCode);

        }
    }

    public class SendMessageRequestCommand : MessageCreateDto, IRequest<ResponseModel<Guid>>
    {
    }
}
