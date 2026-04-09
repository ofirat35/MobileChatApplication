namespace ChatApp.Core.Domain.Entities
{
    public class Chat : AuditableEntity<Guid>, IHasSoftDelete
    {
        public string FromUserId { get; set; }
        public string ToUserId { get; set; }
        public AppUser FromUser { get; set; }
        public AppUser ToUser { get; set; }
        public bool IsValid { get; set; }
        public ICollection<Message>? Messages { get; set; }
    }
}
