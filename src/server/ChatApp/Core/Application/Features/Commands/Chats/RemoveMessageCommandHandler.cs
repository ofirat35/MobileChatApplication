using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Features.Commands.Chats
{
    public class RemoveMessageCommandHandler(
        IMessageService messageService)
      : BaseCommandHandler, IRequestHandler<RemoveMessageRequestCommand, ResponseModel<bool>>
    {
        public async Task<ResponseModel<bool>> Handle(RemoveMessageRequestCommand request, CancellationToken cancellationToken)
        {
            var response = await messageService.DeleteMessageAsync(request.MessageId);
            return response.IsSuccess
                ? ToSuccessResponseModel(response.Value, StatusCodes.Status201Created)
                : ToFailResponseModel<bool>(response.Error, response.StatusCode);

        }
    }

    public class RemoveMessageRequestCommand : IRequest<ResponseModel<bool>>
    {
        public Guid MessageId { get; set; }
    }
}
