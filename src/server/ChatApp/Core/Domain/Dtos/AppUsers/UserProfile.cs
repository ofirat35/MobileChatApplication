using ChatApp.Core.Application.Enums;

namespace ChatApp.Core.Domain.Dtos.AppUsers
{
    public class UserProfile
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public GenderEnum Gender { get; set; }
        public string? Bio { get; set; }
        public DateOnly BirthDate { get; set; }
    }
}
