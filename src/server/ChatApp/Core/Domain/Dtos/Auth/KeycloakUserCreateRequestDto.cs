namespace ChatApp.Core.Domain.Dtos.Auth
{
    public class KeycloakUserCreateRequestDto
    {
        public string Email { get; set; } = default!;
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool Enabled { get; init; } = true;
    }
}
