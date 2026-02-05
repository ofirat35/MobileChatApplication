namespace ChatApp.Core.Domain.Entities
{
    public class UserImage : BaseEntity<Guid>
    {
        public string Bucket { get; set; }
        public string ObjectName { get; set; }
        public long Size { get; set; }
        public DateTime CreatedAt { get; set; }
        public string AppUserId { get; set; }
        public AppUser AppUser { get; set; }
    }
}
