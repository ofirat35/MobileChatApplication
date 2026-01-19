namespace ChatApp.Core.Domain.Dtos.Users
{
    public class UserCreateDto
    {
        public string Email { get; set; } = default!;
        public string Username { get; init; } = default!;
        public string Password { get; init; } = default!;
    }
}
