namespace ChatApp.Core.Domain.Entities
{
    public class Swipe : BaseEntity<Guid>
    {
        public string FromUserId { get; set; }
        public string ToUserId { get; set; }
        public bool IsLike { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
