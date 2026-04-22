using AutoMapper;
using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.Chats;
using ChatApp.Core.Domain.Dtos.Messages;
using ChatApp.Core.Domain.Entities;
using ChatApp.Core.Domain.Models;
using ChatApp.Extensions;
using ChatApp.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace ChatApp.Presentation.Hubs
{
    [Authorize(Policy = "BasicUser")]
    public class ChatHub(
        IPresenceService preferenceService,
        IChatService chatService,
        IMessageService messageService,
        IAppUserService userService,
        IMapper mapper) : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var userId = Context.UserIdentifier!;
            await preferenceService.SetOnline(userId);
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user:{userId}");
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.User.GetUserId();
            await userService.UpdateLastSeenAsync(userId, DateTime.UtcNow);
            await base.OnDisconnectedAsync(exception);
        }

        public async Task<MessageListDto> SendMessageAsync(MessageCreateDto message)
        {
            //check if senderIds are same
            var senderId = Context.UserIdentifier!;
            var user = await userService.GetAppUserByIdAsync(senderId);
            var result = await messageService.SendMessageAsync(message);
            if (!result.IsSuccess) return null;

            var chat = await chatService.GetByIdAsync(message.ChatId, false);
            var sendTo = chat.FromUserId == senderId ? chat.ToUserId : chat.FromUserId;

            var sendContent = new MessageListDto
            {
                Id = result.Value,
                ChatId = message.ChatId,
                Sender = user.Value!,
                Content = message.Content,
                IsRead = false,
                CreatedDate = DateTime.UtcNow
            };
            await Clients.Group($"user:{sendTo}").SendAsync("ReceiveMessage", sendContent);
            sendContent.IsRead = true;
            return sendContent;
        }

        public async Task RemoveMessageAsync(Guid MessageId)
        {
            var senderId = Context.UserIdentifier!;
            var message = await messageService.GetByIdAsync(MessageId);
            var result = await messageService.DeleteMessageAsync(MessageId);
            if (!result.IsSuccess) return;

            var chat = await chatService.GetByIdAsync(message.ChatId, false);
            var sendTo = chat.FromUserId == senderId ? chat.ToUserId : chat.FromUserId;

            await Clients.Group($"user:{sendTo}").SendAsync("RemoveMessage", mapper.Map<MessageListDto>(message));
        }

        public async Task RemoveChatsAsync(List<Guid> chatIds)
        {
            var chats = await chatService.RemoveSelectedChatsAsync(chatIds);
            if (chats.Value is null || chats.Value.Count == 0) return;

            await Clients.Group($"user:{chats.Value[0].MatchedUser.Id}").SendAsync("RemoveChat", chats.Value);
        }


        public async Task Heartbeat()
        {
            await preferenceService.SetOnline(Context.User!.GetUserId());
        }

        public async Task AppWentBackground()
        {
            await preferenceService.SetBackground(Context.User!.GetUserId());
        }

        public async Task<string> GetUserStatus(string targetUserId)
        {
            var status = await preferenceService.GetStatus(targetUserId);
            return status.ToString();
        }
    }
}
