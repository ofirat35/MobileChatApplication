using System.Text.Json.Serialization;

namespace ChatApp.Core.Domain.Dtos.Auth
{
    public class KeyCloakUserListDto
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }
        [JsonPropertyName("username")]
        public string Username { get; set; }
        [JsonPropertyName("firstName")]
        public string FirstName { get; set; }
        [JsonPropertyName("lastName")]
        public string LastName { get; set; }
        [JsonPropertyName("email")]
        public string Email { get; set; }
        [JsonPropertyName("emailVerified")]
        public bool EmailVerified { get; set; }
        [JsonPropertyName("createdTimestamp")]
        public long CreatedTimestamp { get; set; }
    }
}
