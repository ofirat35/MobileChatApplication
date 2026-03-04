namespace ChatApp.Core.Domain.Entities
{
    public class Match : BaseEntity<Guid>
    {
        public string FromUserId { get; set; }
        public string ToUserId{ get; set; }
        public DateTime MatchedAt { get; set; } = DateTime.Now;
        public bool IsValid { get; set; }
    }
}
