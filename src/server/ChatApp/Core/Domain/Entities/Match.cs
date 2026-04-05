namespace ChatApp.Core.Domain.Entities
{
    public class Match : AuditableEntity<Guid>, IHasSoftDelete
    {
        public string FromUserId { get; set; }
        public string ToUserId { get; set; }
        public bool IsValid { get; set; }
    }
}
