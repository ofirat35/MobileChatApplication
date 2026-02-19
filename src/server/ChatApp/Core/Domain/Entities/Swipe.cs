using ChatApp.Core.Application.Enums;

namespace ChatApp.Core.Domain.Entities
{
    public class Swipe : BaseEntity<Guid>
    {
        public string FromUserId { get; set; }
        public string ToUserId { get; set; }
        public SwipeStatus Status { get; set; }
        public bool IsValid { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
