using System.Text.Json.Serialization;

namespace ChatApp.Core.Domain.Dtos.Auth
{
    public class KeycloakUserCreateDto
    {
        [JsonPropertyName("firstName")]
        public string FirstName { get; set; }
        [JsonPropertyName("lastName")]
        public string LastName { get; set; }
        [JsonPropertyName("email")]
        public string Email { get; set; } = default!;
        [JsonPropertyName("enabled")]
        public bool Enabled { get; init; } = true;
        [JsonPropertyName("credentials")]
        public List<KeycloakCredentialDto> Credentials { get; init; } = [];
    }
}
