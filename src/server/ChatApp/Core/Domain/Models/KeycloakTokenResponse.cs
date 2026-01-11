namespace ChatApp.Core.Domain.Models
{
    public sealed class KeycloakTokenResponse
    {
        public string Access_Token { get; init; }
        public int Expires_In { get; init; }
        public string Token_Type { get; init; }
        public string Scope { get; init; }
    }
}
