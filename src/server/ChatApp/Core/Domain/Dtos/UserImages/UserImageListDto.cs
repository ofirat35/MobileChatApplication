namespace ChatApp.Core.Domain.Dtos.UserImages
{
    public class UserImageListDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ImagePath { get; set; }
        public string AppUserId { get; set; }
    }
}
