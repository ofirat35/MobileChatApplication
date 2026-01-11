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
    }
}
