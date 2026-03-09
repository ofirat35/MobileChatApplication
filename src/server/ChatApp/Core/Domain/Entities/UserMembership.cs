namespace ChatApp.Core.Domain.Entities
{
    public class UserMembership : BaseEntity<Guid>
    {
        public string UserId { get; set; }
        public float TotalAmount { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool MembershipEnded { get; set; }
        public Guid MembershipId { get; set; }
        public Membership Membership { get; set; }
    }
}
