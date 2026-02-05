namespace ChatApp.Core.Domain.Dtos.AppUsers
{
    public class AppUserCreateDto
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool Gender { get; set; }
        public string? Bio { get; set; }
        public string Email { get; set; } = default!;
        public DateOnly BirthDate { get; set; }
    }
}
