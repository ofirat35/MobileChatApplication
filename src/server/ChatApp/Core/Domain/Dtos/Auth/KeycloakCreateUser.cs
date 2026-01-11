namespace ChatApp.Core.Domain.Dtos.Auth
{
    public class KeycloakCreateUser
    {
        public string Username { get; init; } = default!;
        public bool Enabled { get; init; } = true;
        public List<KeycloakCredential> Credentials { get; init; } = [];
    }
}
