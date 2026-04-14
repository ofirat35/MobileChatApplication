using ChatApp.Core.Domain.Dtos.AppUsers;
using ChatApp.Core.Domain.Dtos.Messages;

namespace ChatApp.Core.Domain.Dtos.Chats
{
    public class ChatListDto
    {
        public Guid Id { get; set; }
        public AppUserListDto MatchedUser { get; set; }
        public bool IsValid { get; set; }
        public ICollection<MessageListDto>? Messages { get; set; }
        public int UnreadCount { get; set; }
    }
}
