namespace ChatApp.Core.Domain.Entities
{
    public class Membership : BaseEntity<Guid>
    {
        public string Name { get; set; }
        public float Price { get; set; }
        public DateTime CreateDate { get; set; } = DateTime.Now;
        public bool IsValid { get; set; } 
        public ICollection<UserMembership> UserMemberships { get; set; }
    }
}
