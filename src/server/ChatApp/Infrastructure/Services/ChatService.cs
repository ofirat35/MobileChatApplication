using AutoMapper;
using ChatApp.Core.Application.Consts;
using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.AppUsers;
using ChatApp.Core.Domain.Dtos.Chats;
using ChatApp.Core.Domain.Dtos.Messages;
using ChatApp.Core.Domain.Entities;
using ChatApp.Core.Domain.Models;
using ChatApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Infrastructure.Services
{
    public class ChatService(
        ChatAppDbContext dbContext,
        ILogger<ChatService> logger,
        IHttpContextAccessor httpContext,
        IMapper mapper)
        : BaseService<ChatAppDbContext, Chat, Guid>(dbContext, logger, httpContext, EventIds.ChatService),
            IChatService
    {

        public async Task<PaginatedItemsViewModel<ChatListDto>> GetChats(int page, int pageSize = 10)
        {
            var chatsQuery = GetAll()
                   .Where(chat => chat.IsValid
                        && (chat.FromUserId == CurrentUserId || chat.ToUserId == CurrentUserId))
                   .Include(_ => _.Messages.OrderByDescending(_ => _.CreatedDate).Take(1))
                   .Include(_ => _.FromUser)
                   .Include(_ => _.ToUser)
                   .OrderByDescending(_ => _.CreatedDate);

            var totalItems = await chatsQuery.LongCountAsync();

            if (page <= 0) page = 1;
            var chats = await chatsQuery.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
            var mappedChats = mapper.Map<List<ChatListDto>>(chats);
            foreach (var chat in mappedChats)
            {
                var current = chats.First(m => m.Id == chat.Id);
                chat.MatchedUser = mapper.Map<AppUserListDto>(current.FromUserId == CurrentUserId ? current.ToUser : current.FromUser);
                chat.UnreadCount = await DbContext.Messages.CountAsync(_ => _.ChatId == chat.Id && !_.IsRead && _.SenderId != CurrentUserId);
            }

            return new PaginatedItemsViewModel<ChatListDto>(page, pageSize, totalItems, mappedChats);
        }

        public async Task<PaginatedItemsViewModel<MessageListDto>> GetChatById(Guid chatId, int page = 1, int pageSize = 10)
        {
            var messages = DbContext.Messages
                   .Where(match => match.ChatId == chatId)
                   .OrderByDescending(_ => _.CreatedDate);

            var totalItems = await messages.LongCountAsync();
            if (page <= 0) page = 1;
            var matches = await messages.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
            var mappedMatches = mapper.Map<List<MessageListDto>>(matches);
           
            return new PaginatedItemsViewModel<MessageListDto>(page, pageSize, totalItems, mappedMatches);
        }


        public async Task<Result<bool>> RemoveChatAsync(string userId)
        {
            var match = await GetSingleAsync(_ => 
                ((_.FromUserId == userId && _.ToUserId == CurrentUserId)
                || (_.FromUserId == CurrentUserId && _.ToUserId == userId))
                && _.IsValid);
            if (match is null) return Result<bool>.Fail(ExceptionMessages.EntityNotFound, StatusCodes.Status404NotFound);

            await DeleteByIdAsync(match.Id);
            var result = await SaveChangesAsync(match, DbOperation.Delete);

            return result
                ? Result<bool>.Success(true)
                : Result<bool>.Fail(ExceptionMessages.DbOperationFailed, StatusCodes.Status500InternalServerError);
        }
    }
}
