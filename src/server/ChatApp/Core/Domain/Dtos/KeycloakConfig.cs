using System.Text.Json.Serialization;

namespace ChatApp.Core.Domain.Dtos
{
    public class KeycloakConfig
    {
        [ConfigurationKeyName("grant_type")]
        public string GrantType { get; set; }
        [ConfigurationKeyName("client_id")]
        public string ClientId { get; set; }
        [ConfigurationKeyName("client_secret")]
        public string ClientSecret { get; set; }
        [ConfigurationKeyName("realm")]
        public string Realm { get; set; }
        [ConfigurationKeyName("base_url")]
        public string BaseUrl { get; set; }

        [ConfigurationKeyName("openid_configuration_url")]
        public string OpenIdConfigurationUrl { get; set; }
    }

    public class OpenIdConfigurationResponse
    {
        [JsonPropertyName("authorization_endpoint")]
        public string AuthorizationEndpoint { get; set; }
        [JsonPropertyName("token_endpoint")]
        public string TokenEndpoint { get; set; }
        [JsonPropertyName("userinfo_endpoint")]
        public string UserInfoEndpoint { get; set; }

    }
}
