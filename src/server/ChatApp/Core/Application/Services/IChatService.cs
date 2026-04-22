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
        Task<Result<ChatListDto>> GetChatByIdAsync(Guid chatId);
        Task<Result<ChatListDto>> ChatExistsWithUser(string userId);
        Task<PaginatedItemsViewModel<MessageListDto>> GetMessagesByChatId(Guid chatId, int page, int pageSize = 20);
        Task<Result<List<ChatListDto>>> RemoveSelectedChatsAsync(List<Guid> chatIds);
    }
}
