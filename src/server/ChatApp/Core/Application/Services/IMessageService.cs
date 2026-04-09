using ChatApp.Core.Application.Repositories;
using ChatApp.Core.Domain.Dtos.Messages;
using ChatApp.Core.Domain.Entities;
using ChatApp.Core.Domain.Models;

namespace ChatApp.Core.Application.Services
{
    public interface IMessageService : IGenericRepository<Message, Guid>
    {
        Task<Result<bool>> SendMessageAsync(MessageCreateDto message);
        Task<Result<bool>> DeleteMessageAsync(Guid messageId);
    }
}
