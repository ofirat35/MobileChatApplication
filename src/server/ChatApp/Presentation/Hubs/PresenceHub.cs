using ChatApp.Core.Application.Services;
using ChatApp.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace ChatApp.Presentation.Hubs
{
    [Authorize(Policy = "BasicUser")]
    public class PresenceHub(
        IPresenceService preferenceService,
        IAppUserService userService) : Hub
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
