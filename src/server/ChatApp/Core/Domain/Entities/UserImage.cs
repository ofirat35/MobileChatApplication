namespace ChatApp.Core.Domain.Entities
{
    public class UserImage : BaseEntity<Guid>, IHasCreatedDate, IHasSoftDelete
    {
        public string Bucket { get; set; }
        public string ObjectName { get; set; }
        public long Size { get; set; }
        public DateTime CreatedDate { get; set; }
        public string AppUserId { get; set; }
        public AppUser AppUser { get; set; }
        public bool IsProfilePicture { get; set; }
        public bool IsValid { get; set; }
    }
}
