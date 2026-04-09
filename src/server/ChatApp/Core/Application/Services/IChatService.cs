using ChatApp.Core.Application.Repositories;
using ChatApp.Core.Domain.Dtos.Chats;
using ChatApp.Core.Domain.Dtos.Messages;
using ChatApp.Core.Domain.Entities;
using ChatApp.Core.Domain.Models;

namespace ChatApp.Core.Application.Services
{
    public interface IChatService : IGenericRepository<Chat, Guid>
    {
        Task<PaginatedItemsViewModel<ChatListDto>> GetChats(int page, int pageSize = 10);
        Task<PaginatedItemsViewModel<MessageListDto>> GetChatById(Guid chatId, int page, int pageSize = 20);
        Task<Result<bool>> RemoveChatAsync(string userId);
    }
}
