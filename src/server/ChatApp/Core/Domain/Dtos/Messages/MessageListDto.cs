namespace ChatApp.Core.Domain.Dtos.Messages
{
    public class MessageListDto
    {
        public Guid Id { get; set; }
        public Guid ChatId { get; set; }
        public string SenderId { get; set; }
        public string Content { get; set; }
        public bool IsRead { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
