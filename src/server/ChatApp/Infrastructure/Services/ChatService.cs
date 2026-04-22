using AutoMapper;
using Azure.Core;
using ChatApp.Core.Application.Consts;
using ChatApp.Core.Application.Enums;
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
        IAppUserService userService,
        IMapper mapper)
        : BaseService<ChatAppDbContext, Chat, Guid>(dbContext, logger, httpContext, EventIds.ChatService),
            IChatService
    {
        //Daha performanslı olabilir
        public async Task<PaginatedItemsViewModel<ChatListDto>> GetChats(int page, int pageSize = 10)
        {
            var chatsQuery = GetAll()
                   .Where(chat => chat.IsValid
                        && (chat.FromUserId == CurrentUserId || chat.ToUserId == CurrentUserId))
                   .Include(_ => _.FromUser)
                   .Include(_ => _.ToUser)
                   .Include(_ => _.Messages.OrderByDescending(m => m.CreatedDate).Take(1))
                   .OrderByDescending(chat => chat.Messages.Any()
                        ? chat.Messages.Max(m => m.CreatedDate)
                        : chat.CreatedDate);


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

        public async Task<Result<ChatListDto>> GetChatByIdAsync(Guid chatId)
        {
            var chat = await GetAll()
                      .Where(chat => chat.IsValid && chat.Id == chatId)
                      .Include(_ => _.Messages.OrderByDescending(_ => _.CreatedDate).Take(1))
                      .Include(_ => _.FromUser)
                      .Include(_ => _.ToUser)
                      .OrderByDescending(_ => _.CreatedDate)
                      .FirstOrDefaultAsync();

            if (chat is null)
                return Result<ChatListDto>.Fail(ExceptionMessages.EntityNotFound, StatusCodes.Status404NotFound);


            var mappedChat = mapper.Map<ChatListDto>(chat);
            mappedChat.MatchedUser = mapper.Map<AppUserListDto>(chat.FromUserId == CurrentUserId ? chat.ToUser : chat.FromUser);
            mappedChat.UnreadCount = await DbContext.Messages.CountAsync(_ => _.ChatId == chat.Id && !_.IsRead && _.SenderId != CurrentUserId);

            return Result<ChatListDto>.Success(mappedChat);
        }

        public async Task<Result<ChatListDto>> ChatExistsWithUser(string userId)
        {
            var chat = await GetAll()
                      .Where(chat => ((chat.FromUserId == CurrentUserId && chat.ToUserId == userId)
                            || (chat.FromUserId == userId && chat.ToUserId == CurrentUserId))&&
                                chat.IsValid)
                      .Include(_ => _.Messages.OrderByDescending(_ => _.CreatedDate).Take(1))
                      .Include(_ => _.FromUser)
                      .Include(_ => _.ToUser)
                      .OrderByDescending(_ => _.CreatedDate)
                      .FirstOrDefaultAsync();

            if (chat is null)
                return Result<ChatListDto>.Fail(ExceptionMessages.EntityNotFound, StatusCodes.Status404NotFound);


            var mappedChat = mapper.Map<ChatListDto>(chat);
            mappedChat.MatchedUser = mapper.Map<AppUserListDto>(chat.FromUserId == CurrentUserId ? chat.ToUser : chat.FromUser);
            mappedChat.UnreadCount = await DbContext.Messages.CountAsync(_ => _.ChatId == chat.Id && !_.IsRead && _.SenderId != CurrentUserId);

            return Result<ChatListDto>.Success(mappedChat);
        }

        public async Task<PaginatedItemsViewModel<MessageListDto>> GetMessagesByChatId(Guid chatId, int page = 1, int pageSize = 10)
        {
            var messages = DbContext.Messages
                   .Where(match => match.ChatId == chatId)
                   .OrderByDescending(_ => _.CreatedDate);

            var totalItems = await messages.LongCountAsync();
            if (page <= 0) page = 1;
            var paginatedMessages = await messages.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
            var senderIds = paginatedMessages.Select(_ => _.SenderId).ToList();
            var senders = await userService.Get(_ => senderIds.Contains(_.Id), false);

            List<MessageListDto> mappedMessages = [];
            paginatedMessages.ForEach(_ =>
            {
                var message = mapper.Map<MessageListDto>(_);
                message.Sender = mapper.Map<AppUserListDto>(senders.First(s => s.Id == _.SenderId));
                mappedMessages.Add(message);
            });


            return new PaginatedItemsViewModel<MessageListDto>(page, pageSize, totalItems, mappedMessages);
        }

        public async Task<Result<List<ChatListDto>>> RemoveSelectedChatsAsync(List<Guid> chatIds)
        {
            var chats = await Get(_ => chatIds.Contains(_.Id) && _.IsValid, false, [_ => _.ToUser, _ => _.FromUser]);
            if (chats is null || !chats.Any())
                return Result<List<ChatListDto>>.Fail(ExceptionMessages.EntityNotFound, StatusCodes.Status404NotFound);

            var mappedChats = mapper.Map<List<ChatListDto>>(chats);
            foreach (var chat in mappedChats)
            {
                var current = chats.First(m => m.Id == chat.Id);
                chat.MatchedUser = mapper.Map<AppUserListDto>(current.FromUserId == CurrentUserId ? current.ToUser : current.FromUser);
            }
            var validChats = chats.Select(c => new { c.FromUserId, c.ToUserId, c.Id }).ToList();
            await DbContext.Swipes
                .Where(s => (validChats.Select(c => c.FromUserId).Contains(s.FromUserId) && validChats.Select(c => c.ToUserId).Contains(s.ToUserId))
                         || (validChats.Select(c => c.FromUserId).Contains(s.ToUserId) && validChats.Select(c => c.ToUserId).Contains(s.FromUserId)))
                .ExecuteUpdateAsync(s => s
                    .SetProperty(x => x.IsValid, false));
            //.SetProperty(x => x.UpdatedDate, DateTime.UtcNow));

            await GetAll().Where(_ => validChats.Select(c => c.Id).Contains(_.Id))
                .ExecuteUpdateAsync(s => s
                    .SetProperty(x => x.IsValid, false)
                    .SetProperty(x => x.UpdatedDate, DateTime.UtcNow));


            return Result<List<ChatListDto>>.Success(mappedChats);
        }
    };
}
