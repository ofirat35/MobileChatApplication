namespace ChatApp.Core.Domain.Entities
{
    public class Match : BaseEntity<Guid>, IHasCreatedDate, IHasSoftDelete
    {
        public string FromUserId { get; set; }
        public string ToUserId { get; set; }
        public DateTime CreatedDate { get; set; } 
        public bool IsValid { get; set; }
    }
}
