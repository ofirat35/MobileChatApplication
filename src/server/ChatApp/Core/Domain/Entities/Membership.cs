namespace ChatApp.Core.Domain.Entities
{
    public class Membership : BaseEntity<Guid>, IHasCreatedDate, IHasSoftDelete
    {
        public string Name { get; set; }
        public float Price { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool IsValid { get; set; }
        public ICollection<UserMembership> UserMemberships { get; set; }
    }
}
