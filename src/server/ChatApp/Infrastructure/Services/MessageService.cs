using AutoMapper;
using ChatApp.Core.Application.Consts;
using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.Messages;
using ChatApp.Core.Domain.Entities;
using ChatApp.Core.Domain.Models;
using ChatApp.Infrastructure.Data;

namespace ChatApp.Infrastructure.Services
{
    public class MessageService(
        ChatAppDbContext context,
        IHttpContextAccessor httpContext,
        IMapper mapper,
        ILogger<MessageService> logger)
        : BaseService<ChatAppDbContext, Message, Guid>(context, logger, httpContext, EventIds.MessageService),
            IMessageService
    {
        public async Task<Result<bool>> SendMessageAsync(MessageCreateDto message)
        {
            var mappedMessage = mapper.Map<Message>(message);
            await AddAsync(mappedMessage);
            await SaveChangesAsync(mappedMessage, DbOperation.Create);

            return SuccessResult(true);
        }

        public async Task<Result<bool>> DeleteMessageAsync(Guid messageId)
        {
            if (!Any(_ => _.Id == messageId)) return FailResult<bool>(ExceptionMessages.EntityNotFound, StatusCodes.Status404NotFound);

            await DeleteByIdAsync(messageId);
            await SaveChangesAsync();

            return SuccessResult(true);
        }
    }
}
