using ChatApp.Core.Application.Enums;

namespace ChatApp.Core.Domain.Entities
{
    public class AppUser : AuditableEntity<string>, IHasSoftDelete
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public GenderEnum Gender { get; set; }
        public string? Bio { get; set; }
        public string Email { get; set; }
        public string? Country { get; set; }
        public DateOnly BirthDate { get; set; }
        public bool IsValid { get; set; }
        public Preference? Preference { get; set; }
        public List<UserImage> UserImages { get; set; }
        public DateTime LastSeen { get; set; }
    }
}
