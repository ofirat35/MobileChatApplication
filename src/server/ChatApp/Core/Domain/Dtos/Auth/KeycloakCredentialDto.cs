namespace ChatApp.Core.Domain.Dtos.Auth
{
    public sealed class KeycloakCredentialDto
    {
        public string Type { get; init; } = "password";
        public string Value { get; init; } = default!;
        public bool Temporary { get; init; } = false;
    }
}
