namespace ChatApp.Core.Domain.Dtos.Messages
{
    public class MessageCreateDto
    {
        public Guid ChatId { get; set; }
        public string SenderId { get; set; }
        public string Content { get; set; }
    }
}
