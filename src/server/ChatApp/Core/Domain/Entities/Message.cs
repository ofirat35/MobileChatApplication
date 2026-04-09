namespace ChatApp.Core.Domain.Entities
{
    public class Message : BaseEntity<Guid>, IHasCreatedDate
    {
        public Guid ChatId { get; set; }
        public string SenderId { get; set; }
        public string Content { get; set; }
        public bool IsRead { get; set; }
        public DateTime CreatedDate { get; set; }
        public Chat Chat { get; set; }
    }
}
