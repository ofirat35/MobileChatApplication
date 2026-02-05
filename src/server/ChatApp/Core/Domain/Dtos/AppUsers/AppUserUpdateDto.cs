namespace ChatApp.Core.Domain.Dtos.AppUsers
{
    public class AppUserUpdateDto
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; init; } = default!;
        public string? Bio { get; set; }
    }
}
