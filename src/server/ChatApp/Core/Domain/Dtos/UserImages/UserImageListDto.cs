namespace ChatApp.Core.Domain.Dtos.UserImages
{
    public class UserImageListDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string AppUserId { get; set; }
    }
}
