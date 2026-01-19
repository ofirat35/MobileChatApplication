using System.Text.Json.Serialization;

namespace ChatApp.Core.Domain.Dtos.Users
{
    public class UserUpdateDto
    {
        [JsonPropertyName("firstName")]
        public string FirstName { get; init; } = default!;
        [JsonPropertyName("lastName")]
        public string LastName { get; init; } = default!;
        [JsonPropertyName("email")]
        public string Email { get; init; } = default!;
    }
}
